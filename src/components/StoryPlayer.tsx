import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Play, Pause, Square, Volume2, ChevronLeft, ChevronRight, RotateCcw, Loader2, ImageOff } from "lucide-react";
import type { AIStory } from "@/lib/aiStory";
import { generateSceneImage, narrateScene } from "@/lib/aiStory";

interface StoryPlayerProps {
  story: AIStory;
  onAnother: () => void;
  onNextTopic: (topic: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
  immersive?: boolean;
  onImagesGenerated?: (urls: (string | undefined)[]) => void;
}

export function StoryPlayer({
  story, onAnother, onNextTopic, isSaved, onToggleSave, immersive = false, onImagesGenerated,
}: StoryPlayerProps) {
  const scenes = story.scenes;
  const [currentScene, setCurrentScene] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<(string | undefined)[]>(
    () => scenes.map(s => s.imageUrl)
  );
  const [imageLoading, setImageLoading] = useState<boolean[]>(() => scenes.map(() => false));
  const [imageError, setImageError] = useState<boolean[]>(() => scenes.map(() => false));

  // narration
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [narrationLoading, setNarrationLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset on new story
  useEffect(() => {
    setCurrentScene(0);
    setRevealed(false);
    setQuizAnswer(null);
    setAutoPlay(false);
    setImageUrls(scenes.map(s => s.imageUrl));
    setImageLoading(scenes.map(() => false));
    setImageError(scenes.map(() => false));
    stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

  // Lazy-load image for current scene + prefetch next
  useEffect(() => {
    [currentScene, currentScene + 1].forEach((idx) => {
      if (idx < 0 || idx >= scenes.length) return;
      if (imageUrls[idx] || imageLoading[idx] || imageError[idx]) return;
      setImageLoading(prev => { const n = [...prev]; n[idx] = true; return n; });
      generateSceneImage(scenes[idx].imagePrompt, story.artStyle)
        .then(url => {
          setImageUrls(prev => {
            const n = [...prev]; n[idx] = url;
            onImagesGenerated?.(n);
            return n;
          });
        })
        .catch(() => setImageError(prev => { const n = [...prev]; n[idx] = true; return n; }))
        .finally(() => setImageLoading(prev => { const n = [...prev]; n[idx] = false; return n; }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene, scenes, story.artStyle]);

  // reveal animation
  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, [currentScene]);

  // auto-play scene switching
  useEffect(() => {
    if (!autoPlay || !revealed || playing) return;
    const t = setTimeout(() => {
      if (currentScene < scenes.length - 1) setCurrentScene(s => s + 1);
      else setAutoPlay(false);
    }, 5500);
    return () => clearTimeout(t);
  }, [autoPlay, currentScene, revealed, scenes.length, playing]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setPlaying(false);
    setPaused(false);
    setNarrationLoading(false);
  };

  const goNext = useCallback(() => {
    stopAudio();
    if (currentScene < scenes.length - 1) setCurrentScene(s => s + 1);
  }, [currentScene, scenes.length]);

  const goPrev = useCallback(() => {
    stopAudio();
    if (currentScene > 0) setCurrentScene(s => s - 1);
  }, [currentScene]);

  const handlePlayVoice = async () => {
    if (playing) return;
    setNarrationLoading(true);
    try {
      const url = await narrateScene(scenes[currentScene].narration, story.language);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(url);
        // auto-advance if autoplay on
        if (autoPlay && currentScene < scenes.length - 1) {
          setTimeout(() => setCurrentScene(s => s + 1), 600);
        }
      };
      audio.onpause = () => { if (!audio.ended) setPaused(true); };
      audio.onplay = () => setPaused(false);
      await audio.play();
      setPlaying(true);
      setNarrationLoading(false);
    } catch (e) {
      console.error(e);
      setNarrationLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    const d = touchStartX.current - touchEndX.current;
    if (Math.abs(d) > 50) d > 0 ? goNext() : goPrev();
  };

  const isLastScene = currentScene === scenes.length - 1;
  const scene = scenes[currentScene];
  const sceneImg = imageUrls[currentScene];
  const sceneLoading = imageLoading[currentScene];
  const sceneErr = imageError[currentScene];

  return (
    <div className="animate-slide-up">
      {/* Top progress segments */}
      <div className="flex gap-1 mb-4">
        {scenes.map((_, i) => (
          <button
            key={i}
            onClick={() => { stopAudio(); setCurrentScene(i); }}
            className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i <= currentScene ? "hsl(var(--primary))" : "hsl(var(--border))" }}
            aria-label={`Go to scene ${i + 1}`}
          />
        ))}
      </div>

      {/* Scene Card */}
      <div className={`story-card overflow-hidden ${immersive ? "!bg-background/5 !border-background/10" : ""}`}>
        {/* Comic image — top */}
        <div
          className="relative w-full aspect-video bg-muted overflow-hidden touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {sceneImg ? (
            <img
              key={sceneImg}
              src={sceneImg}
              alt={scene.title}
              className="w-full h-full object-cover animate-ken-burns"
            />
          ) : sceneLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Painting your scene…</p>
            </div>
          ) : sceneErr ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="w-8 h-8" />
              <p className="text-xs">Image unavailable</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
          )}
          {/* gradient overlay for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />

          {/* Save button overlay */}
          <button
            onClick={onToggleSave}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
              isSaved
                ? "border-red-300 text-red-500 bg-red-50/90"
                : "border-white/40 text-white bg-black/20 hover:bg-black/30"
            }`}
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Scene title + narration */}
        <div className="p-5 sm:p-7">
          <h2 className={`font-heading text-xl sm:text-2xl font-extrabold leading-tight mb-2 transition-all duration-500 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } ${immersive ? "text-background" : "text-foreground"}`}>
            {scene.title}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-all duration-700 delay-150 ${
              revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            } ${immersive ? "text-background/85" : "text-foreground/80"} ${
              playing ? "narration-glow" : ""
            }`}
          >
            {scene.narration}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 pb-5 gap-3 border-t border-border pt-4">
          <button
            onClick={goPrev}
            disabled={currentScene === 0}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous scene"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {!playing && !narrationLoading && (
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
              >
                <Play className="w-4 h-4" /> Listen
              </button>
            )}
            {narrationLoading && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-sm font-medium text-primary">
                <Loader2 className="w-4 h-4 animate-spin" /> Voicing…
              </div>
            )}
            {playing && (
              <>
                <button
                  onClick={() => {
                    if (!audioRef.current) return;
                    if (paused) audioRef.current.play(); else audioRef.current.pause();
                  }}
                  className="p-2 rounded-xl border border-primary/30 text-primary"
                  aria-label={paused ? "Resume" : "Pause"}
                >
                  {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={stopAudio}
                  className="p-2 rounded-xl border border-border text-muted-foreground hover:text-destructive transition-all"
                  aria-label="Stop"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              </>
            )}

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
            aria-label="Next scene"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            Scene {currentScene + 1} of {scenes.length}
          </p>
        </div>
      </div>

      {/* Outro */}
      {isLastScene && revealed && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="text-center py-3 animate-celebrate">
            <span className="text-lg font-heading font-bold text-accent">✅ You learned something!</span>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold text-primary mb-2">💡 Key Lesson</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">{story.keyLesson}</p>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold text-muted-foreground mb-2">🌍 Real-Life Example</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{story.realLifeExample}</p>
          </div>

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

          <div className="flex gap-3">
            <button onClick={onAnother} className="flex-1 btn-primary py-3 text-sm">
              <RotateCcw className="w-4 h-4 inline mr-1.5" /> Another Story
            </button>
          </div>

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
