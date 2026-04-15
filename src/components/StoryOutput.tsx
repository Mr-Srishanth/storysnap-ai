import { useState, useEffect } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { GeneratedStory } from "@/lib/storyEngine";
import { StoryPlayer } from "@/components/StoryPlayer";

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
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    setQuizAnswer(null);
    setShowQuiz(false);
  }, [story.story]);

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* Title + Save */}
      <div className="flex items-start justify-between">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {story.title}
        </h2>
        <button
          onClick={onToggleSave}
          className={`p-2.5 rounded-xl border transition-all duration-200 shrink-0 ml-4 ${
            isSaved
              ? "border-secondary/50 text-secondary bg-secondary/10"
              : "border-border text-muted-foreground hover:text-secondary hover:border-secondary/30"
          }`}
          title={isSaved ? "Unsave" : "Save"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Scene-based Story Player */}
      {story.scenes && story.scenes.length > 0 && (
        <StoryPlayer story={story} />
      )}

      {/* Post-story content */}
      <div className="space-y-5 animate-slide-up">
        {/* Learned confirmation */}
        <div className="text-center py-3 animate-celebrate">
          <span className="text-lg font-heading font-bold gradient-text">
            ✅ You learned something!
          </span>
        </div>

        {/* Key Lesson */}
        <div className="glass-card p-5">
          <h3 className="font-heading text-sm font-semibold text-primary mb-2">💡 Key Lesson</h3>
          <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">{story.keyLesson}</p>
        </div>

        {/* Real-Life Example */}
        <div className="glass-card p-5">
          <h3 className="font-heading text-sm font-semibold text-accent mb-2">🌍 Real-Life Example</h3>
          <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">{story.realLifeExample}</p>
        </div>

        {/* Mini Quiz */}
        {!showQuiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full py-3.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
          >
            🧠 Quick Quiz — Test yourself!
          </button>
        ) : (
          <div className="glass-card p-5 animate-slide-up">
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
              🧠 {story.quiz.question}
            </h3>
            <div className="space-y-2.5">
              {story.quiz.options.map((opt, idx) => {
                let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ";
                if (quizAnswer === null) {
                  cls += "border-border text-foreground hover:border-primary/50 hover:bg-primary/5";
                } else if (idx === story.quiz.correct) {
                  cls += "border-green-500/50 bg-green-500/10 text-green-400 font-medium";
                } else if (idx === quizAnswer) {
                  cls += "border-red-500/50 bg-red-500/10 text-red-400";
                } else {
                  cls += "border-border text-muted-foreground opacity-40";
                }
                return (
                  <button key={idx} onClick={() => handleQuizAnswer(idx)} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <p className={`mt-3 text-sm font-medium ${quizAnswer === story.quiz.correct ? "text-green-400" : "text-red-400"}`}>
                {quizAnswer === story.quiz.correct ? "🎉 Correct! You nailed it!" : "❌ Not quite — but now you know!"}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
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
        <div className="pt-2">
          <p className="text-xs font-medium text-muted-foreground mb-2.5">🔥 Try next:</p>
          <div className="flex flex-wrap gap-2">
            {story.nextTopics.map(t => (
              <button key={t} onClick={() => onNextTopic(t)} className="chip">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
