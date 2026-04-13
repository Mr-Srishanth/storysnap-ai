import { useState, useCallback, useRef, useEffect } from "react";
import type { Language } from "@/lib/storyEngine";

const voiceLangMap: Record<Language, string> = {
  en: "en",
  hi: "hi",
  te: "te",
};

function findVoice(lang: Language): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const prefix = voiceLangMap[lang];
  return voices.find(v => v.lang.startsWith(prefix)) || voices[0] || null;
}

export function useStorySpeaker() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const linesRef = useRef<string[]>([]);
  const lineIdxRef = useRef(0);
  const stoppedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speakLine = useCallback((lang: Language) => {
    if (stoppedRef.current || lineIdxRef.current >= linesRef.current.length) {
      setSpeaking(false);
      setPaused(false);
      setCurrentLine(-1);
      return;
    }

    const line = linesRef.current[lineIdxRef.current];
    const clean = line.replace(/[^\w\s.,!?'"—\-\u0900-\u097F\u0C00-\u0C7F]/g, "").trim();
    if (!clean) {
      lineIdxRef.current++;
      speakLine(lang);
      return;
    }

    setCurrentLine(lineIdxRef.current);

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    const voice = findVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      lineIdxRef.current++;
      // Pause between lines (300-500ms)
      setTimeout(() => speakLine(lang), 300 + Math.random() * 200);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback((text: string, lang: Language = "en") => {
    speechSynthesis.cancel();
    stoppedRef.current = false;
    linesRef.current = text.split("\n").filter(l => l.trim());
    lineIdxRef.current = 0;
    setSpeaking(true);
    setPaused(false);
    speakLine(lang);
  }, [speakLine]);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentLine(-1);
  }, []);

  return { speaking, paused, currentLine, play, pause, resume, stop };
}
