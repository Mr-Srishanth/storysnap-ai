import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, BookOpen } from "lucide-react";
import { useStoryHistory, type HistoryEntry } from "@/hooks/useStoryHistory";
import { StoryPlayer } from "@/components/StoryPlayer";
import { useProgress } from "@/hooks/useProgress";

const styleEmoji: Record<string, string> = {
  story: "📖", funny: "😂", cinematic: "🎬", teacher: "👨‍🏫",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryPage() {
  const { history, removeEntry, clearHistory } = useStoryHistory();
  const { isSaved, toggleSave } = useProgress();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  if (selected) {
    return (
      <div className="animate-page-enter pb-20 sm:pb-10">
        <section className="max-w-3xl mx-auto px-5 sm:px-10 pt-6">
          <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1">
            ← Back to history
          </button>
          <StoryPlayer
            story={selected.story}
            onAnother={() => {}}
            onNextTopic={() => {}}
            isSaved={isSaved(selected.topic)}
            onToggleSave={() => toggleSave(selected.topic)}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="animate-page-enter pb-20 sm:pb-10">
      <section className="max-w-3xl mx-auto px-5 sm:px-10 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">🕘 History</h1>
            <p className="text-muted-foreground text-sm mt-1">{history.length} stories generated</p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg border border-border">
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-heading font-bold text-muted-foreground mb-2">No history yet</p>
            <p className="text-sm text-muted-foreground mb-6">Generate your first story!</p>
            <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-6">
              <BookOpen className="w-4 h-4" /> Create a Story
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="w-full text-left glass-card p-4 group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-lg">
                  {styleEmoji[entry.style] || "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">{entry.topic}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.story.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-[11px] text-muted-foreground">{timeAgo(entry.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
