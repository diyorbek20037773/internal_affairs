"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { canRecordPcm, startRecording, type ActiveRecording, type RecordedClip } from "@/lib/voice/recorder";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UseSpeechOptions {
  locale: string;
  /** Hard cap for one server-STT recording. Default 15 s (a dialog turn). */
  maxRecordMs?: number;
  /** End the recording by itself after ~1.1 s of silence (hands-free talk). */
  autoStop?: boolean;
  /**
   * Skip /api/stt: expose the recorded clip as `clip` so the caller can send
   * the audio straight to its own model call (one round-trip instead of two).
   */
  direct?: boolean;
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

/** Clean text for reading aloud: drop stage remarks "(…)" and markdown marks. */
export function speakable(text: string): string {
  return text
    .replace(/\([^)]*\)/g, " ")
    .replace(/[*_#>`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface QueueItem {
  text: string;
  audio: Promise<ArrayBuffer | null>;
}

let playCtx: AudioContext | null = null;
function playbackContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!playCtx || playCtx.state === "closed") playCtx = new AC();
  return playCtx;
}

export function useSpeech({ locale, maxRecordMs = 15000, autoStop = false, direct = false }: UseSpeechOptions) {
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [sttError, setSttError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [heard, setHeard] = useState(false);
  const [clip, setClip] = useState<RecordedClip | null>(null);
  const recognitionRef = useRef<any>(null);
  const recRef = useRef<ActiveRecording | null>(null);
  const [sttMode, setSttMode] = useState<"server" | "browser">("browser");
  const [processing, setProcessing] = useState(false);

  // --- TTS queue state ---
  const queueRef = useRef<QueueItem[]>([]);
  const playingRef = useRef(false);
  const genRef = useRef(0);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const canRecord = canRecordPcm();
    // Server STT (Gemini audio) handles Uzbek far better than Web Speech; use it whenever we can record.
    setSttMode(canRecord ? "server" : "browser");
    setSttSupported(canRecord || !!SR);
    setTtsSupported(typeof window !== "undefined" && ("speechSynthesis" in window || !!playbackContext()));
  }, []);

  const transcribe = useCallback(
    async (c: RecordedClip) => {
      setProcessing(true);
      setInterim("…");
      try {
        const res = await fetch("/api/stt", {
          signal: AbortSignal.timeout(30_000),
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: c.base64, mimeType: c.mimeType, locale }),
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
    },
    [locale]
  );

  const startServerRecording = useCallback(async () => {
    try {
      recRef.current?.cancel();
      setTranscript("");
      setSttError(null);
      setInterim("");
      setClip(null);
      setHeard(false);
      const rec = await startRecording({
        autoStop,
        maxMs: maxRecordMs,
        onLevel: setLevel,
        onSpeechStart: () => setHeard(true),
      });
      recRef.current = rec;
      setListening(true);
      const c = await rec.done;
      if (recRef.current === rec) recRef.current = null;
      setListening(false);
      setLevel(0);
      if (!c) return;
      if (!c.speech || c.durationMs < 300) {
        setSttError("no-speech");
        return;
      }
      if (direct) setClip(c);
      else await transcribe(c);
    } catch (err: any) {
      setListening(false);
      setLevel(0);
      setSttError(err?.name === "NotAllowedError" ? "not-allowed" : "start_failed");
    }
  }, [autoStop, direct, maxRecordMs, transcribe]);

  const stopSpeakingInternal = useCallback(() => {
    genRef.current++;
    queueRef.current = [];
    playingRef.current = false;
    try {
      sourceRef.current?.stop();
    } catch {}
    sourceRef.current = null;
    htmlAudioRef.current?.pause();
    htmlAudioRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    // Never record our own voice output.
    stopSpeakingInternal();
    if (sttMode === "server") {
      void startServerRecording();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSttError("unsupported");
      return;
    }
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
  }, [locale, sttMode, startServerRecording, stopSpeakingInternal]);

  const clearSttError = useCallback(() => setSttError(null), []);
  const clearClip = useCallback(() => setClip(null), []);

  const stopListening = useCallback(() => {
    if (recRef.current) {
      recRef.current.stop();
      return;
    }
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  /** Discard the current recording (nothing is sent). */
  const cancelListening = useCallback(() => {
    if (recRef.current) {
      recRef.current.cancel();
      recRef.current = null;
    }
    try {
      recognitionRef.current?.abort?.();
    } catch {}
    setListening(false);
    setLevel(0);
  }, []);

  // ---------------------------------------------------------------- TTS

  const fetchTts = useCallback(
    async (text: string): Promise<ArrayBuffer | null> => {
      try {
        const res = await fetch("/api/tts", {
          signal: AbortSignal.timeout(25_000),
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.slice(0, 1200), locale }),
        });
        if (!res.ok) return null;
        return await res.arrayBuffer();
      } catch {
        return null;
      }
    },
    [locale]
  );

  const browserSpeak = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = TTS_LANG[locale] ?? "uz-UZ";
        const voices = window.speechSynthesis.getVoices();
        const match =
          voices.find((v) => v.lang === utter.lang) || voices.find((v) => v.lang.startsWith(utter.lang.slice(0, 2)));
        if (match) utter.voice = match;
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        window.speechSynthesis.speak(utter);
      }),
    [locale]
  );

  const playBuffer = useCallback(async (buf: ArrayBuffer, gen: number): Promise<void> => {
    const ctx = playbackContext();
    if (ctx) {
      try {
        if (ctx.state === "suspended") await ctx.resume();
        const decoded = await ctx.decodeAudioData(buf.slice(0));
        if (gen !== genRef.current) return;
        await new Promise<void>((resolve) => {
          const src = ctx.createBufferSource();
          src.buffer = decoded;
          src.connect(ctx.destination);
          src.onended = () => resolve();
          sourceRef.current = src;
          src.start();
        });
        return;
      } catch {
        // fall through to <audio>
      }
    }
    const url = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
    try {
      await new Promise<void>((resolve) => {
        const a = new Audio(url);
        htmlAudioRef.current = a;
        a.onended = () => resolve();
        a.onerror = () => resolve();
        a.play().catch(() => resolve());
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const pump = useCallback(async () => {
    if (playingRef.current) return;
    const gen = genRef.current;
    playingRef.current = true;
    setSpeaking(true);
    while (queueRef.current.length && gen === genRef.current) {
      const item = queueRef.current[0];
      const buf = await item.audio;
      if (gen !== genRef.current) break;
      if (buf && buf.byteLength > 44) await playBuffer(buf, gen);
      else await browserSpeak(item.text);
      if (gen !== genRef.current) break;
      queueRef.current.shift();
    }
    if (gen === genRef.current) {
      playingRef.current = false;
      setSpeaking(false);
    }
  }, [browserSpeak, playBuffer]);

  /** Queue a chunk; its audio is fetched right away (prefetch), played in order. */
  const enqueueSpeech = useCallback(
    (text: string) => {
      const clean = speakable(text);
      if (!clean) return;
      queueRef.current.push({ text: clean, audio: fetchTts(clean) });
      void pump();
    },
    [fetchTts, pump]
  );

  /**
   * Speak a whole text. The first sentence goes out as its own request so the
   * voice starts after one short synthesis instead of the full reply's.
   */
  const speak = useCallback(
    async (text: string) => {
      stopSpeakingInternal();
      const clean = speakable(text);
      if (!clean) return;
      const [head, tail] = splitHead(clean);
      enqueueSpeech(head);
      if (tail) enqueueSpeech(tail);
    },
    [enqueueSpeech, stopSpeakingInternal]
  );

  /** Call from a user gesture (e.g. the speaker toggle) so later playback isn't autoplay-blocked. */
  const unlockAudio = useCallback(() => {
    const ctx = playbackContext();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }, []);

  useEffect(
    () => () => {
      recRef.current?.cancel();
      genRef.current++;
      try {
        sourceRef.current?.stop();
      } catch {}
    },
    []
  );

  return {
    sttSupported,
    sttMode,
    processing,
    ttsSupported,
    listening,
    /** VAD heard speech in the current recording. */
    heard,
    /** 0..1 live input level while recording. */
    level,
    speaking,
    transcript,
    interim,
    sttError,
    clearSttError,
    setTranscript,
    /** Recorded clip when `direct` is on. */
    clip,
    clearClip,
    startListening,
    stopListening,
    cancelListening,
    speak,
    enqueueSpeech,
    stopSpeaking: stopSpeakingInternal,
    unlockAudio,
  };
}

export type SpeechApi = ReturnType<typeof useSpeech>;

/** Split off the first sentence (≤ ~160 chars) so audio can start early. */
export function splitHead(text: string): [string, string] {
  const m = /^(.{20,160}?[.!?…])(\s+|$)/s.exec(text);
  if (!m) {
    if (text.length <= 180) return [text, ""];
    const cut = text.lastIndexOf(" ", 140);
    return [text.slice(0, cut > 40 ? cut : 140), text.slice(cut > 40 ? cut + 1 : 140)];
  }
  return [m[1], text.slice(m[0].length).trim()];
}
