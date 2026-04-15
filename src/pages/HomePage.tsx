import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Compass, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/hooks/useProgress";
import { suggestedTopics } from "@/lib/storyEngine";
import heroBook from "@/assets/hero-book.png";

function getRandomTopics(n: number) {
  return [...suggestedTopics].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function HomePage() {
  const { progress } = useProgress();
  const trending = getRandomTopics(8);

  return (
    <div className="animate-page-enter pb-20 sm:pb-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 max-w-xl">
            <span className="badge-pill mb-4 inline-block">✨ AI-Powered Learning</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
              Learn Anything in a <span className="gradient-text">Snap ⚡</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Turn complex topics into short, emotional stories you'll never forget.
            </p>
            <Link
              to="/create"
              className="btn-primary text-base py-3.5 px-10 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Start Learning
            </Link>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end max-w-md lg:max-w-lg">
            <img
              src={heroBook}
              alt="Magical storybook"
              className="w-full max-w-sm lg:max-w-md animate-float select-none pointer-events-none"
            />
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

      {/* Quick Features */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Story Mode", desc: "Learn through short emotional stories", color: "text-primary" },
            { icon: Zap, title: "Instant", desc: "Understand in seconds, not hours", color: "text-accent" },
            { icon: Compass, title: "Explore", desc: "Discover trending topics daily", color: "text-secondary" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="story-card p-6 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
              <h3 className="font-heading font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mb-10">
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
      <footer className="text-center text-xs text-muted-foreground py-8 border-t border-border mt-10">
        <p>StorySnap AI — Learn Anything in a Snap ⚡</p>
        <p className="mt-1">Made with ❤️ for curious minds</p>
      </footer>
    </div>
  );
}
