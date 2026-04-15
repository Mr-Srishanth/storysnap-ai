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
      {streak > 0 && (
        <span className="streak-badge">🔥 {streak} day{streak > 1 ? "s" : ""}</span>
      )}
      <span className="progress-ring">🧠 {topicsLearned} learned</span>
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" style={{
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      }}>
        🎯 {dailyCount}/{dailyGoal}
        <span className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
          <span
            className="block h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: goalMet ? "hsl(var(--success))" : "hsl(var(--primary))",
            }}
          />
        </span>
        {goalMet && <span className="text-xs">✅</span>}
      </span>
    </div>
  );
}
