import { useState, useEffect, useCallback } from "react";

interface ProgressData {
  topicsLearned: number;
  streak: number;
  lastActiveDate: string;
  dailyCount: number;
  dailyGoal: number;
  savedTopics: string[];
}

const STORAGE_KEY = "storysnap-progress";
const DAILY_GOAL = 3;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as ProgressData;
      const today = getToday();
      if (data.lastActiveDate !== today) {
        // Check if streak continues (yesterday)
        const last = new Date(data.lastActiveDate);
        const now = new Date(today);
        const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
        return {
          ...data,
          lastActiveDate: today,
          dailyCount: 0,
          streak: diffDays === 1 ? data.streak + 1 : diffDays === 0 ? data.streak : 0,
        };
      }
      return data;
    }
  } catch {}
  return {
    topicsLearned: 0,
    streak: 0,
    lastActiveDate: getToday(),
    dailyCount: 0,
    dailyGoal: DAILY_GOAL,
    savedTopics: [],
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const recordTopic = useCallback(() => {
    setProgress(p => ({
      ...p,
      topicsLearned: p.topicsLearned + 1,
      dailyCount: p.dailyCount + 1,
      lastActiveDate: getToday(),
      streak: p.streak === 0 && p.dailyCount === 0 ? 1 : p.streak,
    }));
  }, []);

  const toggleSave = useCallback((topic: string) => {
    setProgress(p => {
      const saved = p.savedTopics.includes(topic)
        ? p.savedTopics.filter(t => t !== topic)
        : [...p.savedTopics, topic];
      return { ...p, savedTopics: saved };
    });
  }, []);

  const isSaved = useCallback((topic: string) => {
    return progress.savedTopics.includes(topic);
  }, [progress.savedTopics]);

  return { progress, recordTopic, toggleSave, isSaved };
}
