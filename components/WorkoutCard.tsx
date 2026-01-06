"use client";

import { Check, ChevronRight, Mountain, Zap, Timer, Heart, Footprints, Trophy, Moon } from "lucide-react";
import { getWorkoutTypeColor } from "@/lib/plan-data";

interface WorkoutCardProps {
  date: string;
  dayOfWeek: string;
  milesPlanned: number;
  workoutType: string;
  workoutDescription: string;
  isCompleted: boolean;
  isTaperWeek: boolean;
  isLongRun: boolean;
  isRaceDay: boolean;
  isToday?: boolean;
  actualMiles?: number;
  onClick?: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  Hills: <Mountain className="w-4 h-4" />,
  Intervals: <Zap className="w-4 h-4" />,
  Speed: <Zap className="w-4 h-4" />,
  MP: <Timer className="w-4 h-4" />,
  "Steady/MP": <Timer className="w-4 h-4" />,
  Sharpen: <Timer className="w-4 h-4" />,
  Tempo: <Heart className="w-4 h-4" />,
  Easy: <Footprints className="w-4 h-4" />,
  "Easy+Strides": <Footprints className="w-4 h-4" />,
  Long: <Footprints className="w-4 h-4" />,
  Rest: <Moon className="w-4 h-4" />,
  "Rest/XT": <Moon className="w-4 h-4" />,
  Shakeout: <Footprints className="w-4 h-4" />,
  Race: <Trophy className="w-4 h-4" />,
};

export function WorkoutCard({
  date,
  dayOfWeek,
  milesPlanned,
  workoutType,
  workoutDescription,
  isCompleted,
  isTaperWeek,
  isLongRun,
  isRaceDay,
  isToday = false,
  actualMiles,
  onClick,
}: WorkoutCardProps) {
  const typeColor = getWorkoutTypeColor(workoutType);
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-surface rounded-lg border transition-all ${
        isToday
          ? "border-accent ring-1 ring-accent/50"
          : isCompleted
          ? "border-success/50"
          : "border-border hover:border-muted"
      } ${isTaperWeek ? "opacity-90" : ""}`}
    >
      <div className="flex items-stretch">
        {/* Color stripe */}
        <div className="w-1 rounded-l-lg" style={{ backgroundColor: typeColor }} />

        <div className="flex-1 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted">{dayOfWeek}</span>
              <span className="text-sm text-muted/70">{formattedDate}</span>
              {isToday && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-accent/20 text-accent rounded">
                  Today
                </span>
              )}
              {isRaceDay && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded" style={{ backgroundColor: "#fbbf2433", color: "#fbbf24" }}>
                  Race
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
              ) : (
                <ChevronRight className="w-5 h-5 text-muted" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ color: typeColor }}>{typeIcons[workoutType]}</div>
              <span className="font-semibold text-foreground">{workoutType}</span>
            </div>
            <div className="font-mono text-lg font-bold">
              {isCompleted && actualMiles !== undefined ? (
                <span className="text-success">{actualMiles}</span>
              ) : (
                <span>{milesPlanned}</span>
              )}
              <span className="text-sm text-muted ml-1">mi</span>
            </div>
          </div>

          <p className="text-sm text-muted mt-1 line-clamp-1">{workoutDescription}</p>
        </div>
      </div>
    </button>
  );
}
