import { useState, useCallback, useRef, useEffect } from "react";
import type { Language } from "@/lib/storyEngine";

const voiceLangMap: Record<Language, string> = {
  en: "en",
  hi: "hi",
  te: "te",
};

function findVoices(lang: Language): { narrator: SpeechSynthesisVoice | null; character: SpeechSynthesisVoice | null } {
  const voices = speechSynthesis.getVoices();
  const prefix = voiceLangMap[lang];
  const matching = voices.filter(v => v.lang.startsWith(prefix));

  if (matching.length >= 2) {
    // Try to pick different genders or names
    const female = matching.find(v => /female|woman|zira|samantha|karen|priya|lekha/i.test(v.name));
    const male = matching.find(v => /male|man|david|daniel|ravi|google.*male/i.test(v.name));
    return {
      narrator: female || matching[0],
      character: male || matching[1] || matching[0],
    };
  }

  const fallback = matching[0] || voices[0] || null;
  return { narrator: fallback, character: fallback };
}

function isDialogueLine(line: string): boolean {
  return /^[""\u201C\u201D]/.test(line.trim()) || /[""\u201C\u201D].*said|asked|muttered|whispered|yelled|replied|grinned|laughed|groaned/i.test(line);
}

export function useStorySpeaker() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const linesRef = useRef<string[]>([]);
  const lineIdxRef = useRef(0);
  const stoppedRef = useRef(false);

  useEffect(() => {
    return () => { speechSynthesis.cancel(); };
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
    const { narrator, character } = findVoices(lang);
    const isDialogue = isDialogueLine(line);

    // Dual voice: narrator vs character
    if (isDialogue) {
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      if (character) utterance.voice = character;
    } else {
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      if (narrator) utterance.voice = narrator;
    }

    utterance.onend = () => {
      lineIdxRef.current++;
      const pause = 300 + Math.random() * 400;
      setTimeout(() => speakLine(lang), pause);
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
