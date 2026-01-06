"use client";

import { Check, Play, Mountain, Zap, Timer, Heart, Footprints, Trophy, Moon, Flame, Cookie, Droplets, Bed, Wheat } from "lucide-react";
import { getWorkoutTypeColor, getWorkoutNutritionTip } from "@/lib/plan-data";

interface TodayHeroProps {
  date: string;
  dayOfWeek: string;
  milesPlanned: number;
  workoutType: string;
  workoutDescription: string;
  weekNumber: number;
  isCompleted: boolean;
  isTaperWeek: boolean;
  isLongRun: boolean;
  isRaceDay: boolean;
  actualMiles?: number;
  onLogClick: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  Hills: <Mountain className="w-8 h-8" />,
  Intervals: <Zap className="w-8 h-8" />,
  Speed: <Zap className="w-8 h-8" />,
  MP: <Timer className="w-8 h-8" />,
  "Steady/MP": <Timer className="w-8 h-8" />,
  Sharpen: <Timer className="w-8 h-8" />,
  Tempo: <Heart className="w-8 h-8" />,
  Easy: <Footprints className="w-8 h-8" />,
  "Easy+Strides": <Footprints className="w-8 h-8" />,
  Long: <Footprints className="w-8 h-8" />,
  Rest: <Moon className="w-8 h-8" />,
  "Rest/XT": <Moon className="w-8 h-8" />,
  Shakeout: <Footprints className="w-8 h-8" />,
  Race: <Trophy className="w-8 h-8" />,
};

const nutritionIcons = {
  fuel: Cookie,
  water: Droplets,
  rest: Bed,
  carbs: Wheat,
};

const nutritionColors = {
  fuel: "#f97316",   // orange
  water: "#3b82f6",  // blue
  rest: "#8b5cf6",   // purple
  carbs: "#fbbf24",  // yellow
};

function NutritionTipCard({
  workoutType,
  milesPlanned,
  isLongRun,
  isRaceDay,
  isCompleted,
}: {
  workoutType: string;
  milesPlanned: number;
  isLongRun: boolean;
  isRaceDay: boolean;
  isCompleted: boolean;
}) {
  const tip = getWorkoutNutritionTip(workoutType, milesPlanned, isLongRun, isRaceDay);
  
  if (!tip || isCompleted) return null;
  
  const Icon = nutritionIcons[tip.icon];
  const color = nutritionColors[tip.icon];
  
  return (
    <div 
      className="mb-4 p-3 rounded-lg border flex gap-3 items-start"
      style={{ 
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="font-medium text-sm" style={{ color }}>
          {tip.tip}
        </p>
        <p className="text-xs text-muted">{tip.details}</p>
      </div>
    </div>
  );
}

export function TodayHero({
  date,
  dayOfWeek,
  milesPlanned,
  workoutType,
  workoutDescription,
  weekNumber,
  isCompleted,
  isTaperWeek,
  isLongRun,
  isRaceDay,
  actualMiles,
  onLogClick,
}: TodayHeroProps) {
  const typeColor = getWorkoutTypeColor(workoutType);
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-background border ${
      isCompleted ? "border-success/50" : "border-border"
    }`}>
      {/* Background decoration */}
      <div 
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: `${typeColor}15` }}
      />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted uppercase tracking-wider font-medium">
              Week {weekNumber} {isTaperWeek && "• Taper"}
            </p>
            <h2 className="text-xl font-bold text-foreground">{formattedDate}</h2>
          </div>
          {isRaceDay && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#fbbf2433" }}>
              <Trophy className="w-5 h-5" style={{ color: "#fbbf24" }} />
              <span className="text-sm font-bold" style={{ color: "#fbbf24" }}>RACE DAY</span>
            </div>
          )}
          {isLongRun && !isRaceDay && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#f9731633" }}>
              <Flame className="w-5 h-5" style={{ color: "#f97316" }} />
              <span className="text-sm font-bold" style={{ color: "#f97316" }}>LONG RUN</span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${typeColor}33` }}
          >
            <div style={{ color: typeColor }}>{typeIcons[workoutType]}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{workoutType}</h3>
            <p className="text-muted">{workoutDescription}</p>
          </div>
        </div>

        {/* Miles display */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-muted uppercase tracking-wider">Distance</p>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-5xl font-bold">
                {isCompleted && actualMiles !== undefined ? actualMiles : milesPlanned}
              </span>
              <span className="text-xl text-muted">miles</span>
            </div>
          </div>
          {isCompleted && actualMiles !== undefined && actualMiles !== milesPlanned && (
            <div className="text-right">
              <p className="text-sm text-muted">Planned</p>
              <p className="font-mono text-lg text-muted">{milesPlanned} mi</p>
            </div>
          )}
        </div>
        
        {/* Nutrition tip */}
        <NutritionTipCard
          workoutType={workoutType}
          milesPlanned={milesPlanned}
          isLongRun={isLongRun}
          isRaceDay={isRaceDay}
          isCompleted={isCompleted}
        />

        {/* Action button */}
        <button
          onClick={onLogClick}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isCompleted
              ? "bg-success/20 text-success hover:bg-success/30"
              : "bg-accent text-background hover:bg-accent-hover"
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-6 h-6" />
              Completed — Edit Log
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Log Workout
            </>
          )}
        </button>
      </div>
    </div>
  );
}
