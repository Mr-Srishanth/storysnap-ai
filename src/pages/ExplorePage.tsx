import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import { suggestedTopics } from "@/lib/storyEngine";

const categories: { name: string; emoji: string; topics: string[] }[] = [
  { name: "AI & Tech", emoji: "🤖", topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Blockchain", "Cloud Computing", "Cybersecurity"] },
  { name: "Physics", emoji: "⚛️", topics: ["Quantum Physics", "Relativity", "Black Holes", "Dark Matter", "Gravity", "String Theory"] },
  { name: "Biology", emoji: "🧬", topics: ["DNA & Genetics", "Evolution", "Photosynthesis", "Immune System", "CRISPR", "Stem Cells"] },
  { name: "Space", emoji: "🚀", topics: ["Black Holes", "Big Bang", "Mars Colonization", "Exoplanets", "Dark Energy", "Neutron Stars"] },
  { name: "Coding", emoji: "💻", topics: ["Algorithms", "Data Structures", "APIs", "Recursion", "Big O Notation", "Databases"] },
  { name: "Economics", emoji: "📊", topics: ["Supply & Demand", "Inflation", "Cryptocurrency", "Stock Market", "GDP", "Trade Deficit"] },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTopics = activeCategory
    ? categories.find(c => c.name === activeCategory)?.topics || []
    : suggestedTopics;

  const filtered = search
    ? allTopics.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : allTopics;

  return (
    <div className="animate-page-enter pb-20 sm:pb-10">
      <section className="max-w-3xl mx-auto px-6 sm:px-10 pt-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground mb-2 text-center">
          🔍 Explore Topics
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-6">Discover what to learn next</p>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="input-field !pl-11"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              !activeCategory ? "chip-active" : "chip"
            }`}
          >
            🔥 All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.name ? "chip-active" : "chip"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((topic) => (
            <Link
              key={topic}
              to={`/create?topic=${encodeURIComponent(topic)}`}
              className="glass-card p-5 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">{topic}</p>
                <p className="text-xs text-muted-foreground">Tap to learn →</p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No topics found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </section>
    </div>
  );
}
