import { History, Trash2, X, Clock } from "lucide-react";
import type { HistoryEntry } from "@/hooks/useStoryHistory";
import type { GeneratedStory } from "@/lib/storyEngine";

const styleEmoji: Record<string, string> = {
  adventure: "🏴‍☠️",
  funny: "😂",
  emotional: "❤️",
};

const levelEmoji: Record<string, string> = {
  child: "🧒",
  student: "🎓",
  developer: "💻",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistorySidebar({ open, onClose, history, onSelect, onRemove, onClear }: HistorySidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "hsl(250 25% 10% / 0.95)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid hsl(250 30% 25% / 0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 text-foreground font-heading font-semibold">
            <History className="w-4 h-4 text-primary" />
            Story History
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto h-[calc(100%-57px)] p-3 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
              <Clock className="w-8 h-8 opacity-40" />
              <p>No stories yet</p>
              <p className="text-xs opacity-60">Generated stories will appear here</p>
            </div>
          ) : (
            history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  onSelect(entry);
                  onClose();
                }}
                className="w-full text-left group rounded-xl p-3 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.topic}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {entry.story.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs">{styleEmoji[entry.style]}</span>
                      <span className="text-xs">{levelEmoji[entry.level]}</span>
                      <span className="text-xs text-muted-foreground/60">{timeAgo(entry.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(entry.id);
                    }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
