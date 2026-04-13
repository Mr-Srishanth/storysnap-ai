import { X, Trash2, Clock, History } from "lucide-react";
import type { HistoryEntry } from "@/hooks/useStoryHistory";

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

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistorySidebar({ open, onClose, history, onSelect, onRemove, onClear }: HistorySidebarProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card border-l border-border shadow-xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 font-heading font-bold text-foreground">
            <History className="w-4 h-4 text-primary" /> History
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button onClick={onClear} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2">
                Clear
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
              <Clock className="w-8 h-8 opacity-40" />
              <p>No stories yet</p>
            </div>
          ) : (
            history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => { onSelect(entry); onClose(); }}
                className="w-full text-left group rounded-xl p-3 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{entry.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">{styleEmoji[entry.style] || "📖"}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(entry.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(entry.id); }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
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
