"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkoutCard } from "@/components/WorkoutCard";
import { CompletionModal, CompletionData } from "@/components/CompletionModal";
import { WeekProgress } from "@/components/WeekProgress";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { planData, getWorkoutsByWeek } from "@/lib/plan-data";

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

export default function WeekPage() {
  const params = useParams();
  const router = useRouter();
  const weekNum = parseInt(params.num as string);

  const [workouts, setWorkouts] = useState<WorkoutWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutWithCompletion | null>(null);
  const [completions, setCompletions] = useState<Map<string, CompletionData>>(new Map());

  const today = getLocalDateString();

  // Sort workouts by date
  const sortByDate = (workouts: WorkoutWithCompletion[]) => {
    return [...workouts].sort((a, b) => 
      new Date(a.workout.date).getTime() - new Date(b.workout.date).getTime()
    );
  };

  // Load workouts
  const loadWorkouts = useCallback(async () => {
    try {
      const res = await fetch(`/api/workouts?week=${weekNum}`);
      if (res.ok) {
        const data = await res.json();
        setWorkouts(sortByDate(data));
      } else {
        // Use local data
        const weekWorkouts = getWorkoutsByWeek(weekNum).map((w, i) => ({
          workout: {
            id: (weekNum - 1) * 7 + i + 1,
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
        setWorkouts(sortByDate(weekWorkouts));
      }
    } catch {
      // Use local data
      const weekWorkouts = getWorkoutsByWeek(weekNum).map((w, i) => ({
        workout: {
          id: (weekNum - 1) * 7 + i + 1,
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
      setWorkouts(sortByDate(weekWorkouts));
    } finally {
      setLoading(false);
    }
  }, [weekNum]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Calculate week stats
  const weekPlannedMiles = workouts.reduce(
    (sum, w) => sum + parseFloat(w.workout.milesPlanned),
    0
  );
  const weekActualMiles = workouts.reduce(
    (sum, w) =>
      sum +
      (w.completion?.actualMiles
        ? parseFloat(w.completion.actualMiles)
        : completions.get(w.workout.date)?.actualMiles || 0),
    0
  );
  const workoutsCompleted = workouts.filter(
    (w) => w.completion !== null || completions.has(w.workout.date)
  ).length;

  const isTaperWeek = weekNum >= 6;
  const weekLabel = isTaperWeek
    ? weekNum === 8
      ? "Race Week"
      : "Taper Week"
    : `Week ${weekNum}`;

  const handleOpenModal = (workout: WorkoutWithCompletion) => {
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

  // Date range for the week
  const weekStart =
    workouts.length > 0
      ? new Date(workouts[0].workout.date + "T00:00:00").toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric" }
        )
      : "";
  const weekEnd =
    workouts.length > 0
      ? new Date(
          workouts[workouts.length - 1].workout.date + "T00:00:00"
        ).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header with navigation */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/week/${Math.max(1, weekNum - 1)}`)}
          disabled={weekNum <= 1}
          className="p-2 hover:bg-surface rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-bold">{weekLabel}</h1>
          <p className="text-sm text-muted">
            {weekStart} — {weekEnd}
          </p>
        </div>

        <button
          onClick={() => router.push(`/week/${Math.min(8, weekNum + 1)}`)}
          disabled={weekNum >= 8}
          className="p-2 hover:bg-surface rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </header>

      {/* Taper Notice */}
      {isTaperWeek && (
        <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="font-medium text-warning">Taper Phase</p>
            <p className="text-sm text-muted">
              Reduced mileage to let your body recover and peak for race day.
            </p>
          </div>
        </div>
      )}

      {/* Week Progress */}
      <WeekProgress
        currentWeek={weekNum}
        plannedMiles={weekPlannedMiles}
        actualMiles={weekActualMiles}
        workoutsCompleted={workoutsCompleted}
        workoutsTotal={workouts.length}
      />

      {/* Workouts List */}
      <div className="space-y-3">
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.workout.date}
            date={workout.workout.date}
            dayOfWeek={workout.workout.dayOfWeek}
            milesPlanned={parseFloat(workout.workout.milesPlanned)}
            workoutType={workout.workout.workoutType}
            workoutDescription={workout.workout.workoutDescription}
            isCompleted={
              workout.completion !== null ||
              completions.has(workout.workout.date)
            }
            isTaperWeek={workout.workout.isTaperWeek || false}
            isLongRun={workout.workout.isLongRun || false}
            isRaceDay={workout.workout.isRaceDay || false}
            isToday={workout.workout.date === today}
            actualMiles={
              workout.completion?.actualMiles
                ? parseFloat(workout.completion.actualMiles)
                : completions.get(workout.workout.date)?.actualMiles || undefined
            }
            onClick={() => handleOpenModal(workout)}
          />
        ))}
      </div>

      {/* Week Summary */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h3 className="font-medium mb-3">Week Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted">Planned</p>
            <p className="font-mono text-2xl font-bold">{weekPlannedMiles.toFixed(1)} mi</p>
          </div>
          <div>
            <p className="text-sm text-muted">Actual</p>
            <p className="font-mono text-2xl font-bold text-success">
              {weekActualMiles.toFixed(1)} mi
            </p>
          </div>
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
