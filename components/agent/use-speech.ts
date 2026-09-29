"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal Web Speech API typings (not in TS's DOM lib).
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Japanese speech-to-text. Calls onFinal with the full utterance when the user stops talking. */
export function useSpeechRecognition(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => setSupported(!!getCtor()), []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    recRef.current?.abort();
    const rec = new Ctor();
    rec.lang = "ja-JP";
    rec.interimResults = true;
    rec.continuous = false;
    finalRef.current = "";
    setInterim("");
    setError(null);
    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else live += r[0].transcript;
      }
      setInterim(finalRef.current + live);
    };
    rec.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") setError(e.error === "not-allowed" ? "マイクの使用が許可されていません" : "音声を認識できませんでした");
    };
    rec.onend = () => {
      setListening(false);
      const text = finalRef.current.trim();
      if (text) onFinalRef.current(text);
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, []);

  useEffect(() => () => recRef.current?.abort(), []);

  return { supported, listening, interim, error, start, stop };
}
