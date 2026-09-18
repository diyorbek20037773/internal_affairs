"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UseSpeechOptions {
  locale: string;
  /** Hard cap for one server-STT recording. Default 15 s (a dialog turn). */
  maxRecordMs?: number;
}


/** Decode any recorded blob and re-encode as 16 kHz mono 16-bit PCM WAV (what the STT model expects). */
async function blobToWav16k(blob: Blob): Promise<ArrayBuffer> {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx: AudioContext = new AC();
  const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  const target = 16000;
  const length = Math.ceil(decoded.duration * target);
  const OAC = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const off: OfflineAudioContext = new OAC(1, length, target);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start(0);
  const rendered = await off.startRendering();
  const pcm = rendered.getChannelData(0);
  const out = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(out);
  const w = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  w(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, target, true); v.setUint32(28, target * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, "data"); v.setUint32(40, pcm.length * 2, true);
  let o = 44;
  for (let i = 0; i < pcm.length; i++, o += 2) {
    const x = Math.max(-1, Math.min(1, pcm[i]));
    v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7fff, true);
  }
  try { await ctx.close(); } catch {}
  return out;
}

const STT_LANG: Record<string, string[]> = {
  uz: ["uz-UZ", "ru-RU"],
  ru: ["ru-RU"],
  en: ["en-US"],
};

const TTS_LANG: Record<string, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};

export function useSpeech({ locale, maxRecordMs = 15000 }: UseSpeechOptions) {
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [sttError, setSttError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [sttMode, setSttMode] = useState<"server" | "browser">("browser");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const canRecord =
      typeof window !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia;
    // Server STT (Gemini audio) handles Uzbek far better than Web Speech; use it whenever we can record.
    setSttMode(canRecord ? "server" : "browser");
    setSttSupported(canRecord || !!SR);
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const pickMime = () => {
    const c = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4", "audio/aac"];
    return c.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) ?? "";
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const mime = pickMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setListening(false);
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || mime || "audio/webm" });
        if (blob.size < 2000) { setInterim(""); return; }
        setProcessing(true);
        setInterim("…");
        try {
          // Gemini accepts wav/mp3/ogg/aac but not Chrome's webm — transcode to 16 kHz mono WAV in the browser.
          const wav = await blobToWav16k(blob);
          let bin = "";
          const bytes = new Uint8Array(wav);
          for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
          const res = await fetch("/api/stt", {
            signal: AbortSignal.timeout(45_000),
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: btoa(bin), mimeType: "audio/wav", locale }),
          });
          if (!res.ok) throw new Error(String(res.status));
          const j = (await res.json()) as { text?: string };
          const text = (j.text ?? "").trim();
          if (text) setTranscript(text);
          else setSttError("no-speech");
        } catch {
          setSttError("network");
        } finally {
          setProcessing(false);
          setInterim("");
        }
      };
      recorderRef.current = rec;
      setTranscript("");
      setSttError(null);
      setInterim("");
      rec.start();
      setListening(true);
      // hard cap — a talk turn is short
      window.setTimeout(() => { if (recorderRef.current === rec && rec.state === "recording") rec.stop(); }, maxRecordMs);
    } catch (err: any) {
      setListening(false);
      setSttError(err?.name === "NotAllowedError" ? "not-allowed" : "start_failed");
    }
  }, [locale, maxRecordMs]);

  const startListening = useCallback(() => {
    if (sttMode === "server") {
      void startRecording();
      return;
    }
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSttError("unsupported");
      return;
    }
    // stop any previous instance
    try {
      recognitionRef.current?.abort?.();
    } catch {}

    const recognition = new SR();
    recognition.lang = (STT_LANG[locale] ?? ["uz-UZ"])[0];
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      if (finalText) setTranscript((prev) => (prev + " " + finalText).trim());
      setInterim(interimText);
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };
    recognition.onerror = (e: any) => {
      setListening(false);
      setInterim("");
      setSttError(e?.error || "error");
    };

    recognitionRef.current = recognition;
    setTranscript("");
    setSttError(null);
    try {
      recognition.start();
      setListening(true);
    } catch (err: any) {
      setListening(false);
      setSttError(err?.name === "InvalidStateError" ? "busy" : "start_failed");
    }
  }, [locale, sttMode, startRecording]);

  const clearSttError = useCallback(() => setSttError(null), []);

  const stopListening = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      return;
    }
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // Browser SpeechSynthesis — fallback only (limited/no Uzbek voice).
  const browserSpeak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = TTS_LANG[locale] ?? "uz-UZ";
      const voices = window.speechSynthesis.getVoices();
      const match =
        voices.find((v) => v.lang === utter.lang) ||
        voices.find((v) => v.lang.startsWith(utter.lang.slice(0, 2)));
      if (match) utter.voice = match;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [locale]
  );

  // High-quality server TTS (Gemini) with browser fallback. Works for uz/ru/en.
  const speak = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // stop any current playback
      audioRef.current?.pause();
      audioRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      setSpeaking(true);
      try {
        const res = await fetch("/api/tts", {
          signal: AbortSignal.timeout(30_000),
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed.slice(0, 1200), locale }),
        });
        if (!res.ok) throw new Error("tts_failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(url);
          if (audioRef.current === audio) audioRef.current = null;
        };
        audio.onerror = () => {
          setSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audio.play();
      } catch {
        // fallback to browser voice
        browserSpeak(trimmed);
      }
    },
    [locale, browserSpeak]
  );

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return {
    sttSupported,
    sttMode,
    processing,
    ttsSupported,
    listening,
    speaking,
    transcript,
    interim,
    sttError,
    clearSttError,
    setTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
