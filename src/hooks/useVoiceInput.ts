import { useState, useCallback, useRef } from "react";
import type { Language } from "@/lib/storyEngine";

const langMap: Record<Language, string> = {
  en: "en-US",
  hi: "hi-IN",
  te: "te-IN",
};

export function useVoiceInput(language: Language) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!isSupported) return;

    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new Ctor();
    rec.lang = langMap[language] || "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setListening(false);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, [language, isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, startListening, stopListening, isSupported };
}
