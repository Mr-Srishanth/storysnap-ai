import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Square, Volume2, SkipForward } from "lucide-react";
import type { GeneratedStory, Language } from "@/lib/storyEngine";
import { useStorySpeaker } from "@/hooks/useStorySpeaker";

interface StoryPlayerProps {
  story: GeneratedStory;
}

export function StoryPlayer({ story }: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const speaker = useStorySpeaker();
  const scenes = story.scenes;
  const scene = scenes[currentScene];

  useEffect(() => {
    setCurrentScene(0);
    setAutoPlay(false);
    speaker.stop();
  }, [story]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(c => c + 1);
      } else {
        setAutoPlay(false);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [autoPlay, currentScene, scenes.length]);

  const goNext = useCallback(() => {
    if (currentScene < scenes.length - 1) setCurrentScene(c => c + 1);
  }, [currentScene, scenes.length]);

  const goPrev = useCallback(() => {
    if (currentScene > 0) setCurrentScene(c => c - 1);
  }, [currentScene]);

  const handleListen = () => {
    if (speaker.speaking) {
      speaker.stop();
    } else {
      speaker.play(scene.narration, story.language);
    }
  };

  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      {/* Scene visual area */}
      <div className="scene-image-container flex items-center justify-center p-8">
        <div className="text-center">
          <span className="text-6xl mb-4 block animate-float">{scene.emoji}</span>
          <p className="text-sm text-muted-foreground font-medium">Scene {currentScene + 1} of {scenes.length}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
          <div className="scene-progress-bar h-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentScene(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentScene
                  ? "bg-primary scale-125"
                  : i < currentScene
                  ? "bg-primary/40"
                  : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scene content */}
      <div className="p-6 sm:p-8">
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3">
          {scene.title}
        </h3>
        <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-6">
          {scene.description}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentScene === 0}
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleListen}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                speaker.speaking
                  ? "border-primary/40 text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
              }`}
            >
              {speaker.speaking ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Speaking…</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              onClick={goNext}
              disabled={currentScene === scenes.length - 1}
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              autoPlay
                ? "border-accent/40 text-accent bg-accent/10"
                : "border-border text-muted-foreground hover:text-accent hover:border-accent/30"
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <SkipForward className="w-3.5 h-3.5" />}
            {autoPlay ? "Pause" : "Auto"}
          </button>
        </div>
      </div>
    </div>
  );
}
