import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Play, Pause, Square, Volume2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { GeneratedStory } from "@/lib/storyEngine";
import { useStorySpeaker } from "@/hooks/useStorySpeaker";

interface StoryPlayerProps {
  story: GeneratedStory;
  onAnother: () => void;
  onNextTopic: (topic: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
  immersive?: boolean;
}

export function StoryPlayer({ story, onAnother, onNextTopic, isSaved, onToggleSave, immersive = false }: StoryPlayerProps) {
  const scenes = story.story.split("\n").filter(l => l.trim());
  const [currentScene, setCurrentScene] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const speaker = useStorySpeaker();
  
  // Swipe gesture support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset on new story
  useEffect(() => {
    setCurrentScene(0);
    setRevealed(false);
    setQuizAnswer(null);
    setAutoPlay(false);
    speaker.stop();
  }, [story.story]);

  // Reveal animation
  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, [currentScene]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !revealed) return;
    const t = setTimeout(() => {
      if (currentScene < scenes.length - 1) setCurrentScene(s => s + 1);
      else setAutoPlay(false);
    }, 4000);
    return () => clearTimeout(t);
  }, [autoPlay, currentScene, revealed, scenes.length]);

  const goNext = useCallback(() => {
    if (currentScene < scenes.length - 1) setCurrentScene(s => s + 1);
  }, [currentScene, scenes.length]);

  const goPrev = useCallback(() => {
    if (currentScene > 0) setCurrentScene(s => s - 1);
  }, [currentScene]);

  const handlePlayVoice = () => {
    speaker.play(scenes[currentScene], story.language);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // minimum pixels to trigger swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left → next scene
        goNext();
      } else {
        // Swiped right → previous scene
        goPrev();
      }
    }
  };

  const isLastScene = currentScene === scenes.length - 1;
  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <div className="animate-slide-up">
      {/* Progress bar */}
      <div className="flex gap-1 mb-4">
        {scenes.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-500 cursor-pointer"
            style={{ background: i <= currentScene ? "hsl(var(--primary))" : "hsl(var(--border))" }}
            onClick={() => setCurrentScene(i)}
          />
        ))}
      </div>

      {/* Scene Card */}
      <div className={`story-card overflow-hidden ${immersive ? "!bg-background/5 !border-background/10" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className={`font-heading text-xl sm:text-2xl font-bold leading-tight ${immersive ? "text-background" : "text-foreground"}`}>
            📖 {story.title}
          </h2>
          <button
            onClick={onToggleSave}
            className={`p-2 rounded-xl border transition-all duration-200 shrink-0 ${
              isSaved
                ? "border-red-300 text-red-500 bg-red-50"
                : "border-border text-muted-foreground hover:text-red-500 hover:border-red-300"
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Scene content */}
        <div 
          className="p-5 sm:p-8 min-h-[180px] flex items-center touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <p
            className={`text-lg sm:text-xl leading-relaxed transition-all duration-700 ${
              revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${
              scenes[currentScene]?.includes("💡")
                ? "text-primary font-semibold"
                : immersive ? "text-background/90" : "text-foreground/85"
            }`}
          >
            {scenes[currentScene]}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 pb-5 gap-3">
          <button
            onClick={goPrev}
            disabled={currentScene === 0}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {/* Voice */}
            {!speaker.speaking ? (
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
              >
                <Play className="w-4 h-4" /> Listen
              </button>
            ) : (
              <>
                <button
                  onClick={speaker.paused ? speaker.resume : speaker.pause}
                  className="p-2 rounded-xl border border-primary/30 text-primary transition-all"
                >
                  {speaker.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={speaker.stop}
                  className="p-2 rounded-xl border border-border text-muted-foreground hover:text-destructive transition-all"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              </>
            )}

            {/* Auto-play toggle */}
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                autoPlay
                  ? "border-primary/30 text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-primary"
              }`}
            >
              {autoPlay ? "⏸ Auto" : "▶ Auto"}
            </button>
          </div>

          <button
            onClick={goNext}
            disabled={isLastScene}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scene counter */}
        <div className="px-5 pb-4">
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Scene {currentScene + 1} of {scenes.length}
          </p>
        </div>
      </div>

      {/* After completing all scenes */}
      {isLastScene && revealed && (
        <div className="mt-6 space-y-4 animate-slide-up">
          {/* Learned badge */}
          <div className="text-center py-3 animate-celebrate">
            <span className="text-lg font-heading font-bold text-accent">✅ You learned something!</span>
          </div>

          {/* Key Lesson */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold text-primary mb-2">💡 Key Lesson</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">{story.keyLesson}</p>
          </div>

          {/* Real-Life Example */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold text-muted-foreground mb-2">🌍 Real-Life Example</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{story.realLifeExample}</p>
          </div>

          {/* Quiz */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">🧠 {story.quiz.question}</h3>
            <div className="space-y-2">
              {story.quiz.options.map((opt, idx) => {
                let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ";
                if (quizAnswer === null) cls += "border-border text-foreground hover:border-primary/50 hover:bg-primary/5";
                else if (idx === story.quiz.correct) cls += "border-green-400 bg-green-50 text-green-700 font-medium";
                else if (idx === quizAnswer) cls += "border-red-300 bg-red-50 text-red-600";
                else cls += "border-border text-muted-foreground opacity-60";
                return (
                  <button key={idx} onClick={() => quizAnswer === null && setQuizAnswer(idx)} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <p className={`mt-3 text-sm font-medium ${quizAnswer === story.quiz.correct ? "text-green-600" : "text-red-500"}`}>
                {quizAnswer === story.quiz.correct ? "🎉 Correct!" : "❌ Not quite — now you know!"}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onAnother} className="flex-1 btn-primary py-3 text-sm">
              <RotateCcw className="w-4 h-4 inline mr-1.5" /> Another Story
            </button>
          </div>

          {/* Next topics */}
          <div className="glass-card p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2.5">🔥 Try next:</p>
            <div className="flex flex-wrap gap-2">
              {story.nextTopics.map(t => (
                <button key={t} onClick={() => onNextTopic(t)} className="chip">{t}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
