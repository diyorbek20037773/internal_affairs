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
  const recognitionRef = useRef<any>(null);

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
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = (STT_LANG[locale] ?? ["uz-UZ"])[0];
    recognition.continuous = false;
    recognition.interimResults = true;

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
    recognition.onerror = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    setTranscript("");
    recognition.start();
    setListening(true);
  }, [locale]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = TTS_LANG[locale] ?? "uz-UZ";
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.startsWith(utter.lang.slice(0, 2)));
      if (match) utter.voice = match;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [locale]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return {
    sttSupported,
    ttsSupported,
    listening,
    speaking,
    transcript,
    interim,
    setTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
