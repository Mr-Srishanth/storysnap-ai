// Client wrapper for StorySnap AI edge functions
import { supabase } from "@/integrations/supabase/client";
import type { Language, ExplainLevel, StoryStyle } from "@/lib/storyEngine";

export type ArtStyle = "comic" | "anime" | "realistic";

export interface AIScene {
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface AIStory {
  title: string;
  scenes: AIScene[];
  keyLesson: string;
  realLifeExample: string;
  quiz: { question: string; options: string[]; correct: number };
  nextTopics: string[];
  language: Language;
  artStyle: ArtStyle;
  topic: string;
}

export async function generateAIStory(opts: {
  topic: string;
  language: Language;
  level: ExplainLevel;
  style: StoryStyle;
  artStyle: ArtStyle;
}): Promise<AIStory> {
  const { data, error } = await supabase.functions.invoke("generate-story", {
    body: {
      topic: opts.topic,
      language: opts.language,
      level: opts.level,
      style: opts.style,
    },
  });
  if (error) throw new Error(error.message || "Story generation failed");
  if (!data?.story) throw new Error("Empty response");
  return {
    ...data.story,
    language: opts.language,
    artStyle: opts.artStyle,
    topic: opts.topic,
  };
}

export async function generateSceneImage(prompt: string, style: ArtStyle): Promise<string> {
  const { data, error } = await supabase.functions.invoke("generate-scene-image", {
    body: { prompt, style },
  });
  if (error) throw new Error(error.message || "Image generation failed");
  return data.imageUrl as string;
}

export async function narrateScene(text: string, language: Language): Promise<string> {
  // Use direct fetch so we can stream the audio blob (functions.invoke parses JSON only)
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/narrate-scene`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ text, language }),
  });
  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Narration failed: ${resp.status} ${t}`);
  }
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
}
