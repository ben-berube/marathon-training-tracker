"use client";

interface WeekProgressProps {
  currentWeek: number;
  plannedMiles: number;
  actualMiles: number;
  workoutsCompleted: number;
  workoutsTotal: number;
}

export function WeekProgress({
  currentWeek,
  plannedMiles,
  actualMiles,
  workoutsCompleted,
  workoutsTotal,
}: WeekProgressProps) {
  const completionPercent = workoutsTotal > 0 ? (workoutsCompleted / workoutsTotal) * 100 : 0;
  const milesPercent = plannedMiles > 0 ? Math.min((actualMiles / plannedMiles) * 100, 100) : 0;

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (milesPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border">
      {/* Progress ring */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-background"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-accent"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-bold">{actualMiles.toFixed(0)}</span>
          <span className="text-xs text-muted">/ {plannedMiles}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1">
        <p className="text-sm text-muted uppercase tracking-wider">Week {currentWeek}</p>
        <p className="text-lg font-bold text-foreground">{milesPercent.toFixed(0)}% Complete</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex -space-x-1">
            {Array.from({ length: workoutsTotal }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border-2 border-surface ${
                  i < workoutsCompleted ? "bg-success" : "bg-muted/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted ml-2">
            {workoutsCompleted}/{workoutsTotal} workouts
          </span>
        </div>
      </div>
    </div>
  );
}
