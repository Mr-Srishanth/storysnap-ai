import { GeneratedStory } from "@/lib/storyEngine";
import { useTypewriter } from "@/hooks/useTypewriter";

interface StoryOutputProps {
  story: GeneratedStory;
  onSimpler: () => void;
  onAnother: () => void;
  loading: boolean;
}

export function StoryOutput({ story, onSimpler, onAnother, loading }: StoryOutputProps) {
  const { displayed, done } = useTypewriter(story.story, 14);

  return (
    <div className="animate-slide-up">
      <div className="glass-card p-6 sm:p-8 glow-primary">
        {/* Title */}
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-6 glow-text">
          📖 {story.title}
        </h2>

        {/* Story body */}
        <div className="mb-6">
          <div className="text-foreground leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {displayed}
            {!done && <span className="typewriter-cursor" />}
          </div>
        </div>

        {/* After typing complete */}
        {done && (
          <div className="animate-slide-up space-y-4">
            {/* Summary */}
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-lg font-semibold text-secondary mb-2">
                📝 Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.summary}
              </p>
            </div>

            {/* Key Lesson */}
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-lg font-semibold text-accent mb-2">
                💡 Key Lesson
              </h3>
              <p className="text-foreground font-medium">
                {story.keyLesson}
              </p>
            </div>

            {/* Real-Life Example */}
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                🌍 Real-Life Example
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.realLifeExample}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={onSimpler}
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium border border-border text-muted-foreground hover:border-secondary/60 hover:text-secondary transition-all duration-300"
              >
                🧒 Explain Simpler
              </button>
              <button
                onClick={onAnother}
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-all duration-300"
              >
                🔄 Another Version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
