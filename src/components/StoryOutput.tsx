import { GeneratedStory } from "@/lib/storyEngine";
import { useTypewriter } from "@/hooks/useTypewriter";

interface StoryOutputProps {
  story: GeneratedStory;
}

export function StoryOutput({ story }: StoryOutputProps) {
  const { displayed, done } = useTypewriter(story.story, 18);

  return (
    <div className="animate-slide-up">
      <div className="glass-card p-6 sm:p-8 glow-primary">
        {/* Title */}
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-6 glow-text">
          📖 {story.title}
        </h2>

        {/* Story body */}
        <div className="mb-6">
          <p className="text-foreground leading-relaxed text-base sm:text-lg">
            {displayed}
            {!done && <span className="typewriter-cursor" />}
          </p>
        </div>

        {/* Summary - show after typing */}
        {done && (
          <div className="animate-slide-up space-y-4">
            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-lg font-semibold text-secondary mb-2">
                📝 Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {story.summary}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-heading text-lg font-semibold text-accent mb-2">
                💡 Key Lesson
              </h3>
              <p className="text-foreground font-medium">
                {story.keyLesson}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
