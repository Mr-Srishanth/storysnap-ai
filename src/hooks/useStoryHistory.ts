import { useState, useCallback, useEffect } from "react";
import type { GeneratedStory, StoryStyle, ExplainLevel } from "@/lib/storyEngine";

export interface HistoryEntry {
  id: string;
  topic: string;
  style: StoryStyle;
  level: ExplainLevel;
  story: GeneratedStory;
  createdAt: number;
}

const STORAGE_KEY = "storysnap-history";
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useStoryHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((topic: string, style: StoryStyle, level: ExplainLevel, story: GeneratedStory) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      topic,
      style,
      level,
      story,
      createdAt: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
