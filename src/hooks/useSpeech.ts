"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UseSpeechOptions {
  locale: string;
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

export function useSpeech({ locale }: UseSpeechOptions) {
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [sttError, setSttError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSttSupported(!!SR);
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const startListening = useCallback(() => {
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
  }, [locale]);

  const clearSttError = useCallback(() => setSttError(null), []);

  const stopListening = useCallback(() => {
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
