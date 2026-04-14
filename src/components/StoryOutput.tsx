import { useState, useEffect } from "react";
import { Heart, Play, Pause, Square, RotateCcw, Volume2 } from "lucide-react";
import { GeneratedStory } from "@/lib/storyEngine";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useStorySpeaker } from "@/hooks/useStorySpeaker";

interface StoryOutputProps {
  story: GeneratedStory;
  onSimpler: () => void;
  onAnother: () => void;
  onNextTopic: (topic: string) => void;
  loading: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  immersive?: boolean;
}

export function StoryOutput({ story, onSimpler, onAnother, onNextTopic, loading, isSaved, onToggleSave, immersive = false }: StoryOutputProps) {
  const { displayed, done } = useTypewriter(story.story, 18);
  const speaker = useStorySpeaker();
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Stop speaking when a new story comes in
  useEffect(() => {
    speaker.stop();
    setQuizAnswer(null);
    setShowQuiz(false);
  }, [story.story]);

  const storyLines = story.story.split("\n").filter(l => l.trim());

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
  };

  return (
    <div className="animate-slide-up">
      <div className={`story-card p-7 sm:p-10 ${immersive ? "!bg-transparent !border-none !shadow-none" : ""}`}>
        {/* Title + actions */}
        <div className="flex items-start justify-between mb-6">
          <h2 className={`font-heading text-2xl sm:text-3xl font-bold leading-tight ${immersive ? "text-background" : "text-foreground"}`}>
            📖 {story.title}
          </h2>
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={onToggleSave}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                isSaved
                  ? "border-red-300 text-red-500 bg-red-50"
                  : "border-border text-muted-foreground hover:text-red-500 hover:border-red-300"
              }`}
              title={isSaved ? "Unsave" : "Save"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Story body — line-by-line with highlight support */}
        <div className="mb-6">
          {done ? (
            <div className="space-y-3">
              {storyLines.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-base sm:text-lg leading-relaxed transition-all duration-300 ${
                    speaker.speaking && speaker.currentLine === idx
                      ? "text-primary font-medium bg-primary/5 -mx-2 px-2 py-1 rounded-lg"
                      : line.includes("💡")
                      ? "aha-highlight text-primary font-semibold"
                      : "text-foreground/85"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-foreground/85 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {displayed}
              <span className="typewriter-cursor" />
            </div>
          )}
        </div>

        {/* Playback controls */}
        {done && (
          <div className="flex items-center gap-2 mb-6 animate-slide-up">
            {!speaker.speaking ? (
              <button
                onClick={() => speaker.play(story.story, story.language)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                <Play className="w-4 h-4" /> Listen
              </button>
            ) : (
              <>
                <button
                  onClick={speaker.paused ? speaker.resume : speaker.pause}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-sm font-medium text-primary transition-all duration-200"
                >
                  {speaker.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {speaker.paused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={speaker.stop}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all duration-200"
                >
                  <Square className="w-3.5 h-3.5" /> Stop
                </button>
                {/* Speaking indicator */}
                <span className="flex items-center gap-1.5 text-xs text-primary ml-2">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  Speaking…
                </span>
              </>
            )}
          </div>
        )}

        {/* After typing complete */}
        {done && (
          <div className="animate-slide-up space-y-5">
            {/* Learned confirmation */}
            <div className="text-center py-3 animate-celebrate">
              <span className="text-lg font-heading font-bold text-accent">
                ✅ You learned something!
              </span>
            </div>

            {/* Key Lesson */}
            <div className="border-t border-border pt-5">
              <h3 className="font-heading text-sm font-semibold text-primary mb-2">
                💡 Key Lesson
              </h3>
              <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                {story.keyLesson}
              </p>
            </div>

            {/* Real-Life Example */}
            <div className="border-t border-border pt-5">
              <h3 className="font-heading text-sm font-semibold text-muted-foreground mb-2">
                🌍 Real-Life Example
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {story.realLifeExample}
              </p>
            </div>

            {/* Mini Quiz */}
            {!showQuiz ? (
              <div className="border-t border-border pt-5">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
                >
                  🧠 Quick Quiz — Test yourself!
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-5 animate-slide-up">
                <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                  🧠 {story.quiz.question}
                </h3>
                <div className="space-y-2.5">
                  {story.quiz.options.map((opt, idx) => {
                    let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ";
                    if (quizAnswer === null) {
                      cls += "border-border text-foreground hover:border-primary/50 hover:bg-primary/5";
                    } else if (idx === story.quiz.correct) {
                      cls += "border-green-400 bg-green-50 text-green-700 font-medium";
                    } else if (idx === quizAnswer) {
                      cls += "border-red-300 bg-red-50 text-red-600";
                    } else {
                      cls += "border-border text-muted-foreground opacity-60";
                    }
                    return (
                      <button key={idx} onClick={() => handleQuizAnswer(idx)} className={cls}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer !== null && (
                  <p className={`mt-3 text-sm font-medium ${quizAnswer === story.quiz.correct ? "text-green-600" : "text-red-500"}`}>
                    {quizAnswer === story.quiz.correct ? "🎉 Correct! You nailed it!" : "❌ Not quite — but now you know!"}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={onSimpler}
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-medium border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                🧒 Simpler
              </button>
              <button
                onClick={onAnother}
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-medium border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1.5" />
                Another
              </button>
            </div>

            {/* Next Topics */}
            <div className="border-t border-border pt-5">
              <p className="text-xs font-medium text-muted-foreground mb-2.5">🔥 Try next:</p>
              <div className="flex flex-wrap gap-2">
                {story.nextTopics.map(t => (
                  <button
                    key={t}
                    onClick={() => onNextTopic(t)}
                    className="chip"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
