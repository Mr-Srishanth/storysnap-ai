import { useState, useRef } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { StoryOutput } from "@/components/StoryOutput";
import { generateStory, generateSimplerVersion, suggestedTopics, type StoryStyle, type ExplainLevel, type GeneratedStory } from "@/lib/storyEngine";

const styles: { value: StoryStyle; label: string }[] = [
  { value: "adventure", label: "Adventure 🏴‍☠️" },
  { value: "funny", label: "Funny 😂" },
  { value: "emotional", label: "Emotional ❤️" },
];

const levels: { value: ExplainLevel; label: string; icon: string }[] = [
  { value: "child", label: "I'm 5", icon: "🧒" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "developer", label: "Developer", icon: "💻" },
];

function getRandomTopics(n: number) {
  const shuffled = [...suggestedTopics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function Index() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<StoryStyle>("adventure");
  const [level, setLevel] = useState<ExplainLevel>("student");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [suggested] = useState(() => getRandomTopics(6));
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (overrideTopic?: string) => {
    const t = (overrideTopic || topic).trim();
    if (!t || loading) return;
    if (overrideTopic) setTopic(overrideTopic);
    setLoading(true);
    setStory(null);
    setFollowUp("");

    setTimeout(() => {
      const result = generateStory(t, style, level);
      setStory(result);
      setLoading(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1200);
  };

  const handleSimpler = () => {
    if (!story || loading) return;
    setLoading(true);
    setTimeout(() => {
      const result = generateSimplerVersion(story, topic.trim());
      setStory(result);
      setLoading(false);
    }, 800);
  };

  const handleFollowUp = () => {
    if (!followUp.trim() || loading) return;
    const combined = `${topic.trim()} — specifically: ${followUp.trim()}`;
    setFollowUp("");
    handleGenerate(combined);
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

            {/* Suggested Topics */}
            <div className="flex flex-wrap gap-2">
              {suggested.map((t) => (
                <button
                  key={t}
                  onClick={() => handleGenerate(t)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-all duration-300"
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Style selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Story Style
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

            {/* Explain Like selector */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Explain Like…
              </label>
              <div className="flex gap-3">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 border ${
                      level === l.value
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-input border-border text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    {l.icon} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => handleGenerate()}
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
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="rounded-xl px-5 py-3 border border-border text-muted-foreground font-medium transition-all duration-300 hover:border-primary/50 hover:text-foreground"
                  title="Another Version"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output */}
        <div ref={outputRef}>
          {story && (
            <StoryOutput
              story={story}
              onSimpler={handleSimpler}
              onAnother={() => handleGenerate()}
              loading={loading}
            />
          )}
        </div>

        {/* Follow-up input */}
        {story && !loading && (
          <div className="glass-card p-5 mt-6 animate-slide-up">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              🧠 Ask a follow-up question…
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFollowUp()}
                placeholder="e.g., How does it actually work in practice?"
                className="flex-1 rounded-xl bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 border border-border outline-none transition-all duration-300 input-glow focus:border-primary text-sm"
              />
              <button
                onClick={handleFollowUp}
                disabled={!followUp.trim()}
                className="btn-glow rounded-xl px-5 py-2.5 text-primary-foreground font-medium text-sm"
              >
                Ask ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
