import { useState, useRef } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { StoryOutput } from "@/components/StoryOutput";
import { generateStory, type StoryStyle, type GeneratedStory } from "@/lib/storyEngine";

const styles: { value: StoryStyle; label: string }[] = [
  { value: "adventure", label: "Adventure 🏴‍☠️" },
  { value: "funny", label: "Funny 😂" },
  { value: "emotional", label: "Emotional ❤️" },
];

export default function Index() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<StoryStyle>("adventure");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setStory(null);

    setTimeout(() => {
      const result = generateStory(topic.trim(), style);
      setStory(result);
      setLoading(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen animate-page-enter">
      <ParticleBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground glow-text mb-3">
            📖 StorySnap
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Learn Anything in a Snap ⚡
          </p>
        </header>

        {/* Input Card */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="space-y-5">
            {/* Topic input */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Enter a hard topic (e.g., AI, Blockchain, Quantum Physics)"
                className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/50 border border-border outline-none transition-all duration-300 input-glow focus:border-primary"
              />
            </div>

            {/* Style selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Choose Story Style
              </label>
              <div className="flex gap-3">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 border ${
                      style === s.value
                        ? "bg-primary/20 border-primary text-primary glow-primary"
                        : "bg-input border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="btn-glow flex-1 rounded-xl px-6 py-3 text-primary-foreground font-semibold text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating
                    <span className="loading-dots" />
                  </span>
                ) : (
                  "Generate Story ✨"
                )}
              </button>
              {story && (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="rounded-xl px-5 py-3 border border-border text-muted-foreground font-medium transition-all duration-300 hover:border-primary/50 hover:text-foreground"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output */}
        <div ref={outputRef}>
          {story && <StoryOutput story={story} />}
        </div>
      </div>
    </div>
  );
}
