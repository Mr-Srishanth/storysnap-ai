import { useState } from "react";
import { Heart, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { GeneratedStory } from "@/lib/storyEngine";
import { useTypewriter } from "@/hooks/useTypewriter";

interface StoryOutputProps {
  story: GeneratedStory;
  onSimpler: () => void;
  onAnother: () => void;
  onNextTopic: (topic: string) => void;
  loading: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function StoryOutput({ story, onSimpler, onAnother, onNextTopic, loading, isSaved, onToggleSave }: StoryOutputProps) {
  const { displayed, done } = useTypewriter(story.story, 18);
  const [speaking, setSpeaking] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleListen = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(story.story.replace(/[^\w\s.,!?'"—-]/g, ""));
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
  };

  return (
    <div className="animate-slide-up">
      <div className="story-card p-6 sm:p-8">
        {/* Title + actions */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            📖 {story.title}
          </h2>
          <div className="flex gap-2 ml-3 shrink-0">
            <button
              onClick={handleListen}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
              title={speaking ? "Stop" : "Listen"}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleSave}
              className={`p-2 rounded-lg border transition-all duration-200 ${
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

        {/* Story body */}
        <div className="mb-5">
          <div className="text-foreground leading-relaxed text-base whitespace-pre-line">
            {displayed}
            {!done && <span className="typewriter-cursor" />}
          </div>
        </div>

        {/* After typing complete */}
        {done && (
          <div className="animate-slide-up space-y-4">
            {/* Learned confirmation */}
            <div className="text-center py-3 animate-celebrate">
              <span className="text-lg font-heading font-bold text-accent">
                ✅ You learned something!
              </span>
            </div>

            {/* Key Lesson */}
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-sm font-semibold text-primary mb-1.5">
                💡 Key Lesson
              </h3>
              <p className="text-foreground text-sm font-medium">
                {story.keyLesson}
              </p>
            </div>

            {/* Real-Life Example */}
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-sm font-semibold text-muted-foreground mb-1.5">
                🌍 Real-Life Example
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {story.realLifeExample}
              </p>
            </div>

            {/* Mini Quiz */}
            {!showQuiz ? (
              <div className="border-t border-border pt-4">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
                >
                  🧠 Quick Quiz — Test yourself!
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-4 animate-slide-up">
                <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                  🧠 {story.quiz.question}
                </h3>
                <div className="space-y-2">
                  {story.quiz.options.map((opt, idx) => {
                    let cls = "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ";
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
                  <p className={`mt-2 text-sm font-medium ${quizAnswer === story.quiz.correct ? "text-green-600" : "text-red-500"}`}>
                    {quizAnswer === story.quiz.correct ? "🎉 Correct! You nailed it!" : "❌ Not quite — but now you know!"}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onSimpler}
                disabled={loading}
                className="flex-1 rounded-xl px-3 py-2.5 text-sm font-medium border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                🧒 Simpler
              </button>
              <button
                onClick={onAnother}
                disabled={loading}
                className="flex-1 rounded-xl px-3 py-2.5 text-sm font-medium border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                Another
              </button>
            </div>

            {/* Next Topics — addiction loop */}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">🔥 Try next:</p>
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
