import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Compass, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/hooks/useProgress";
import { suggestedTopics } from "@/lib/storyEngine";

function getRandomTopics(n: number) {
  return [...suggestedTopics].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function HomePage() {
  const { progress } = useProgress();
  const trending = getRandomTopics(8);

  return (
    <div className="animate-page-enter pb-20 sm:pb-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 max-w-xl">
            <span className="badge-pill mb-5 inline-block">✨ AI-Powered Learning</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-5">
              Learn Anything as a{" "}
              <span className="gradient-text">Story ⚡</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-3">
              Turn complex topics into short, engaging stories you'll never forget.
            </p>
            <p className="text-muted-foreground/60 text-sm mb-8">
              From Topic → Story in Seconds
            </p>
            <Link
              to="/create"
              className="btn-primary text-base py-4 px-10 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Start Learning
            </Link>
          </div>

          {/* Illustration replacement: animated emoji scene */}
          <div className="flex-1 flex justify-center lg:justify-end max-w-md">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-glow" />
              <div className="absolute inset-4 rounded-full bg-primary/5 flex items-center justify-center">
                <span className="text-8xl animate-float select-none">📖</span>
              </div>
              <span className="absolute top-6 right-8 text-3xl animate-float" style={{ animationDelay: "0.5s" }}>✨</span>
              <span className="absolute bottom-10 left-6 text-2xl animate-float" style={{ animationDelay: "1s" }}>🧠</span>
              <span className="absolute top-20 left-4 text-2xl animate-float" style={{ animationDelay: "1.5s" }}>🎬</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mb-10">
        <ProgressBar
          streak={progress.streak}
          topicsLearned={progress.topicsLearned}
          dailyCount={progress.dailyCount}
          dailyGoal={progress.dailyGoal}
        />
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Story Mode", desc: "Learn through short emotional stories", color: "text-primary" },
            { icon: Zap, title: "Instant", desc: "Understand in seconds, not hours", color: "text-accent" },
            { icon: Compass, title: "Explore", desc: "Discover trending topics daily", color: "text-secondary" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-6 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
              <h3 className="font-heading font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mb-12">
        <h2 className="font-heading font-bold text-lg text-foreground mb-4 text-center">🔥 Trending Topics</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {trending.map((t) => (
            <Link key={t} to={`/create?topic=${encodeURIComponent(t)}`} className="chip">
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground/50 py-8 border-t border-border mt-10">
        <p className="gradient-text font-heading font-bold text-sm mb-1">StorySnap AI</p>
        <p>Learn Anything as a Story ⚡</p>
        <p className="mt-1">Made with ❤️ for curious minds</p>
      </footer>
    </div>
  );
}
