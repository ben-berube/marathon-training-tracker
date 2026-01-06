"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check, Trophy } from "lucide-react";
import { CompletionModal, CompletionData } from "@/components/CompletionModal";
import { planData, getWorkoutTypeColor } from "@/lib/plan-data";

// Helper to get local date string in YYYY-MM-DD format (avoids UTC timezone issues)
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface WorkoutWithCompletion {
  workout: {
    id: number;
    date: string;
    dayOfWeek: string;
    weekNumber: number;
    milesPlanned: string;
    workoutType: string;
    workoutDescription: string;
    isTaperWeek: boolean | null;
    isLongRun: boolean | null;
    isRaceDay: boolean | null;
  };
  completion: {
    id: number;
    workoutId: number;
    actualMiles: string | null;
    durationMinutes: number | null;
    rpe: number | null;
    notes: string | null;
    fuelingCarbsPerHour: number | null;
    fuelingHydration: string | null;
  } | null;
}

export default function CalendarPage() {
  // Default to current month, or January 2026 if before training period
  const getInitialMonth = () => {
    const now = new Date();
    const trainingStart = new Date("2026-01-01");
    return now >= trainingStart ? now : trainingStart;
  };
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const [workouts, setWorkouts] = useState<WorkoutWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutWithCompletion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [completions, setCompletions] = useState<Map<string, CompletionData>>(new Map());

  const today = getLocalDateString();

  // Load all workouts
  const loadWorkouts = useCallback(async () => {
    try {
      const res = await fetch("/api/workouts");
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      } else {
        // Use local data
        const allWorkouts = planData.map((w, i) => ({
          workout: {
            id: i + 1,
            date: w.date,
            dayOfWeek: w.day,
            weekNumber: w.weekNumber,
            milesPlanned: w.milesPlanned.toString(),
            workoutType: w.type,
            workoutDescription: w.workout,
            isTaperWeek: w.isTaperWeek,
            isLongRun: w.isLongRun,
            isRaceDay: w.isRaceDay,
          },
          completion: null,
        }));
        setWorkouts(allWorkouts);
      }
    } catch {
      const allWorkouts = planData.map((w, i) => ({
        workout: {
          id: i + 1,
          date: w.date,
          dayOfWeek: w.day,
          weekNumber: w.weekNumber,
          milesPlanned: w.milesPlanned.toString(),
          workoutType: w.type,
          workoutDescription: w.workout,
          isTaperWeek: w.isTaperWeek,
          isLongRun: w.isLongRun,
          isRaceDay: w.isRaceDay,
        },
        completion: null,
      }));
      setWorkouts(allWorkouts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  // Create workout lookup map
  const workoutMap = new Map<string, WorkoutWithCompletion>();
  workouts.forEach((w) => {
    workoutMap.set(w.workout.date, w);
  });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (workout: WorkoutWithCompletion) => {
    setSelectedWorkout(workout);
    setModalOpen(true);
  };

  const handleSaveCompletion = async (data: CompletionData) => {
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        loadWorkouts();
      }
    } catch {
      if (selectedWorkout) {
        const newCompletions = new Map(completions);
        newCompletions.set(selectedWorkout.workout.date, data);
        setCompletions(newCompletions);
      }
    }
    setModalOpen(false);
  };

  const handleDeleteCompletion = async () => {
    if (!selectedWorkout) return;

    try {
      await fetch(`/api/completions?workoutId=${selectedWorkout.workout.id}`, {
        method: "DELETE",
      });
      loadWorkouts();
    } catch {
      const newCompletions = new Map(completions);
      newCompletions.delete(selectedWorkout.workout.date);
      setCompletions(newCompletions);
    }
    setModalOpen(false);
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold">{monthLabel}</h1>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </header>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs text-muted font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = getLocalDateString(day);
          const workout = workoutMap.get(dateStr);
          const isToday = dateStr === today;
          const isCompleted =
            workout?.completion !== null || completions.has(dateStr);
          const typeColor = workout
            ? getWorkoutTypeColor(workout.workout.workoutType)
            : "";

          return (
            <button
              key={dateStr}
              onClick={() => workout && handleDayClick(workout)}
              disabled={!workout}
              className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all ${
                workout
                  ? `bg-surface border hover:border-muted ${
                      isToday
                        ? "border-accent ring-1 ring-accent/50"
                        : isCompleted
                        ? "border-success/50"
                        : "border-border"
                    }`
                  : "opacity-30"
              }`}
            >
              <span
                className={`text-sm ${
                  isToday ? "font-bold text-accent" : "text-foreground"
                }`}
              >
                {day.getDate()}
              </span>

              {workout && (
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                  {/* Workout type indicator */}
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColor }} />

                  {/* Miles badge */}
                  <span className="text-[10px] font-mono text-muted">
                    {parseFloat(workout.workout.milesPlanned)}
                  </span>

                  {/* Status indicators */}
                  <div className="flex items-center gap-0.5">
                    {isCompleted && (
                      <Check className="w-3 h-3 text-success" />
                    )}
                    {workout.workout.isRaceDay && (
                      <Trophy className="w-3 h-3 text-type-race" />
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h3 className="text-sm font-medium text-muted mb-3">Workout Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { type: "Hills", color: "#ef4444" },
            { type: "Intervals", color: "#8b5cf6" },
            { type: "MP/Tempo", color: "#3b82f6" },
            { type: "Easy", color: "#6b7280" },
            { type: "Long", color: "#f97316" },
            { type: "Rest", color: "#404040" },
            { type: "Race", color: "#fbbf24" },
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      {selectedWorkout && (
        <CompletionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCompletion}
          onDelete={
            selectedWorkout.completion ||
            completions.has(selectedWorkout.workout.date)
              ? handleDeleteCompletion
              : undefined
          }
          workout={{
            id: selectedWorkout.workout.id,
            date: selectedWorkout.workout.date,
            workoutType: selectedWorkout.workout.workoutType,
            milesPlanned: parseFloat(selectedWorkout.workout.milesPlanned),
            workoutDescription: selectedWorkout.workout.workoutDescription,
            isLongRun: selectedWorkout.workout.isLongRun || false,
          }}
          existingCompletion={
            selectedWorkout.completion
              ? {
                  actualMiles: selectedWorkout.completion.actualMiles
                    ? parseFloat(selectedWorkout.completion.actualMiles)
                    : null,
                  durationMinutes: selectedWorkout.completion.durationMinutes,
                  rpe: selectedWorkout.completion.rpe,
                  notes: selectedWorkout.completion.notes,
                  fuelingCarbsPerHour:
                    selectedWorkout.completion.fuelingCarbsPerHour,
                  fuelingHydration: selectedWorkout.completion.fuelingHydration,
                }
              : completions.has(selectedWorkout.workout.date)
              ? {
                  actualMiles:
                    completions.get(selectedWorkout.workout.date)?.actualMiles ||
                    null,
                  durationMinutes:
                    completions.get(selectedWorkout.workout.date)
                      ?.durationMinutes || null,
                  rpe:
                    completions.get(selectedWorkout.workout.date)?.rpe || null,
                  notes:
                    completions.get(selectedWorkout.workout.date)?.notes || null,
                  fuelingCarbsPerHour:
                    completions.get(selectedWorkout.workout.date)
                      ?.fuelingCarbsPerHour || null,
                  fuelingHydration:
                    completions.get(selectedWorkout.workout.date)
                      ?.fuelingHydration || null,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
