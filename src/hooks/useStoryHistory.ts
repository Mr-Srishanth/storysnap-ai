import { useState, useCallback, useEffect } from "react";
import type { AIStory } from "@/lib/aiStory";
import type { StoryStyle, ExplainLevel } from "@/lib/storyEngine";

export interface HistoryEntry {
  id: string;
  topic: string;
  style: StoryStyle;
  level: ExplainLevel;
  story: AIStory;
  createdAt: number;
}

const STORAGE_KEY = "storysnap-history-v2";
const MAX_ENTRIES = 30;

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // storage might be full; trim and retry
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
      } catch {}
    }
  }, [history]);

  const addEntry = useCallback((topic: string, style: StoryStyle, level: ExplainLevel, story: AIStory) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      topic, style, level, story,
      createdAt: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const updateEntry = useCallback((id: string, story: AIStory) => {
    setHistory((prev) => prev.map(e => e.id === id ? { ...e, story } : e));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, updateEntry, removeEntry, clearHistory };
}
