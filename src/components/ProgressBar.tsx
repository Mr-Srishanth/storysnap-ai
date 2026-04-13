interface ProgressBarProps {
  streak: number;
  topicsLearned: number;
  dailyCount: number;
  dailyGoal: number;
}

export function ProgressBar({ streak, topicsLearned, dailyCount, dailyGoal }: ProgressBarProps) {
  const pct = Math.min((dailyCount / dailyGoal) * 100, 100);
  const goalMet = dailyCount >= dailyGoal;

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {/* Streak */}
      {streak > 0 && (
        <span className="streak-badge">
          🔥 {streak} day{streak > 1 ? "s" : ""}
        </span>
      )}

      {/* Topics */}
      <span className="progress-ring">
        🧠 {topicsLearned} learned
      </span>

      {/* Daily goal */}
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
        🎯 {dailyCount}/{dailyGoal}
        <span className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
          <span
            className="block h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: goalMet ? "hsl(var(--accent))" : "hsl(var(--primary))",
            }}
          />
        </span>
        {goalMet && <span className="text-xs">✅</span>}
      </span>
    </div>
  );
}
