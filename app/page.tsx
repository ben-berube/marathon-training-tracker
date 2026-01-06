"use client";

import { useState, useEffect, useCallback } from "react";
import { TodayHero } from "@/components/TodayHero";
import { WorkoutCard } from "@/components/WorkoutCard";
import { CompletionModal, CompletionData } from "@/components/CompletionModal";
import { WeekProgress } from "@/components/WeekProgress";
import { Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { planData, getWorkoutsByWeek, getWeeklyPlannedMiles } from "@/lib/plan-data";

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

// Get today's workout from plan data (returns null if today isn't in the plan)
function getTodayFromPlanData() {
  const todayStr = getLocalDateString();
  
  // Find today's workout in plan data - returns undefined if not found
  return planData.find(w => w.date === todayStr) || null;
}

// Get the current week number based on today's date
function getCurrentWeekNumber() {
  const todayStr = getLocalDateString();
  const planStart = "2026-01-05";
  const planEnd = "2026-03-01";
  
  // If before training, return week 1
  if (todayStr < planStart) return 1;
  // If after training, return week 8
  if (todayStr > planEnd) return 8;
  
  // Find the week for today
  const todayWorkout = planData.find(w => w.date === todayStr);
  return todayWorkout?.weekNumber || 1;
}

// Check training status
function getTrainingStatus() {
  const todayStr = getLocalDateString();
  const planStart = "2026-01-05";
  const planEnd = "2026-03-01";
  
  if (todayStr < planStart) {
    const today = new Date();
    const planStartDate = new Date("2026-01-05T00:00:00");
    const daysUntilStart = Math.ceil((planStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { status: "before", daysUntilStart };
  }
  if (todayStr > planEnd) {
    return { status: "after" };
  }
  return { status: "active" };
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState<WorkoutWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutWithCompletion | null>(null);
  const [completions, setCompletions] = useState<Map<string, CompletionData>>(new Map());

  // Get today's date and training status (using local timezone)
  const today = getLocalDateString();
  const todayPlanData = getTodayFromPlanData();
  const currentWeek = getCurrentWeekNumber();
  const trainingStatus = getTrainingStatus();

  // Sort workouts by date
  const sortByDate = (workouts: WorkoutWithCompletion[]) => {
    return [...workouts].sort((a, b) => 
      new Date(a.workout.date).getTime() - new Date(b.workout.date).getTime()
    );
  };

  // Load workouts - try API first, fall back to local data
  const loadWorkouts = useCallback(async () => {
    try {
      const res = await fetch(`/api/workouts?week=${currentWeek}`);
      if (res.ok) {
        const data = await res.json();
        setWorkouts(sortByDate(data));
      } else {
        // Use local data for offline/demo mode
        const weekWorkouts = getWorkoutsByWeek(currentWeek).map((w, i) => ({
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
        setWorkouts(sortByDate(weekWorkouts));
      }
    } catch {
      // Use local data for offline mode
      const weekWorkouts = getWorkoutsByWeek(currentWeek).map((w, i) => ({
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
      setWorkouts(sortByDate(weekWorkouts));
    } finally {
      setLoading(false);
    }
  }, [currentWeek]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Find today's workout (only if today is actually in the plan)
  const todayWorkout = workouts.find((w) => w.workout.date === today) || null;
  
  // Find the next upcoming workout
  const getNextWorkout = () => {
    // If training hasn't started, show the first workout
    if (trainingStatus.status === "before") {
      return workouts[0] || null;
    }
    // If we have today's workout, show the next one
    if (todayWorkout) {
      const todayIndex = workouts.findIndex((w) => w.workout.date === today);
      return todayIndex >= 0 && todayIndex < workouts.length - 1 
        ? workouts[todayIndex + 1] 
        : null;
    }
    // If today isn't in the plan but we're in training period, find next workout after today
    return workouts.find(w => w.workout.date > today) || null;
  };
  
  const nextWorkout = getNextWorkout();

  // Calculate week progress
  const weekPlannedMiles = workouts.reduce(
    (sum, w) => sum + parseFloat(w.workout.milesPlanned),
    0
  );
  const weekActualMiles = workouts.reduce(
    (sum, w) => sum + (w.completion?.actualMiles ? parseFloat(w.completion.actualMiles) : 
      (completions.get(w.workout.date)?.actualMiles || 0)),
    0
  );
  const workoutsCompleted = workouts.filter(
    (w) => w.completion !== null || completions.has(w.workout.date)
  ).length;

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
        // Reload workouts to get updated completion
        loadWorkouts();
      }
    } catch {
      // Store locally for offline mode
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
      // Remove from local storage
      const newCompletions = new Map(completions);
      newCompletions.delete(selectedWorkout.workout.date);
      setCompletions(newCompletions);
    }
    setModalOpen(false);
  };

  // Days until race
  const raceDate = new Date("2026-03-01");
  const todayDate = new Date();
  const daysUntilRace = Math.ceil((raceDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marathon Training</h1>
          <p className="text-sm text-muted">8-Week Training Plan</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-type-race">
            <Trophy className="w-4 h-4" />
            <span className="font-mono font-bold">{daysUntilRace}</span>
          </div>
          <p className="text-xs text-muted">days to race</p>
        </div>
      </header>

      {/* Week Progress */}
      <WeekProgress
        currentWeek={currentWeek}
        plannedMiles={weekPlannedMiles}
        actualMiles={weekActualMiles}
        workoutsCompleted={workoutsCompleted}
        workoutsTotal={workouts.length}
      />

      {/* Pre-Training Message */}
      {trainingStatus.status === "before" && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border border-accent/30 p-6 text-center">
          <div className="text-4xl mb-3">🏃‍♂️</div>
          <h2 className="text-xl font-bold mb-2">Training Starts Soon!</h2>
          <p className="text-muted mb-4">
            Your 8-week marathon training begins on <span className="text-accent font-semibold">January 5, 2026</span>
          </p>
          <div className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-full">
            <span className="font-mono text-2xl font-bold text-accent">{trainingStatus.daysUntilStart}</span>
            <span className="text-muted">days until training</span>
          </div>
        </div>
      )}

      {/* Today's Workout (only shown during active training) */}
      {trainingStatus.status === "active" && todayWorkout && (
        <TodayHero
          date={todayWorkout.workout.date}
          dayOfWeek={todayWorkout.workout.dayOfWeek}
          milesPlanned={parseFloat(todayWorkout.workout.milesPlanned)}
          workoutType={todayWorkout.workout.workoutType}
          workoutDescription={todayWorkout.workout.workoutDescription}
          weekNumber={todayWorkout.workout.weekNumber}
          isCompleted={todayWorkout.completion !== null || completions.has(todayWorkout.workout.date)}
          isTaperWeek={todayWorkout.workout.isTaperWeek || false}
          isLongRun={todayWorkout.workout.isLongRun || false}
          isRaceDay={todayWorkout.workout.isRaceDay || false}
          actualMiles={
            todayWorkout.completion?.actualMiles
              ? parseFloat(todayWorkout.completion.actualMiles)
              : completions.get(todayWorkout.workout.date)?.actualMiles || undefined
          }
          onLogClick={() => handleOpenModal(todayWorkout)}
        />
      )}

      {/* Up Next / First Workout Preview */}
      {nextWorkout && (
        <div>
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
            {trainingStatus.status === "before" ? "First Workout" : "Up Next"}
          </h2>
          <WorkoutCard
            date={nextWorkout.workout.date}
            dayOfWeek={nextWorkout.workout.dayOfWeek}
            milesPlanned={parseFloat(nextWorkout.workout.milesPlanned)}
            workoutType={nextWorkout.workout.workoutType}
            workoutDescription={nextWorkout.workout.workoutDescription}
            isCompleted={nextWorkout.completion !== null || completions.has(nextWorkout.workout.date)}
            isTaperWeek={nextWorkout.workout.isTaperWeek || false}
            isLongRun={nextWorkout.workout.isLongRun || false}
            isRaceDay={nextWorkout.workout.isRaceDay || false}
            onClick={() => handleOpenModal(nextWorkout)}
          />
        </div>
      )}

      {/* This Week Link */}
      <Link
        href={`/week/${currentWeek}`}
        className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-muted transition-colors"
      >
        <div>
          <p className="font-medium">View Full Week {currentWeek}</p>
          <p className="text-sm text-muted">
            {workoutsCompleted}/{workouts.length} workouts completed
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted" />
      </Link>

      {/* Completion Modal */}
      {selectedWorkout && (
        <CompletionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCompletion}
          onDelete={selectedWorkout.completion || completions.has(selectedWorkout.workout.date) ? handleDeleteCompletion : undefined}
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
                  fuelingCarbsPerHour: selectedWorkout.completion.fuelingCarbsPerHour,
                  fuelingHydration: selectedWorkout.completion.fuelingHydration,
                }
              : completions.has(selectedWorkout.workout.date)
              ? {
                  actualMiles: completions.get(selectedWorkout.workout.date)?.actualMiles || null,
                  durationMinutes: completions.get(selectedWorkout.workout.date)?.durationMinutes || null,
                  rpe: completions.get(selectedWorkout.workout.date)?.rpe || null,
                  notes: completions.get(selectedWorkout.workout.date)?.notes || null,
                  fuelingCarbsPerHour: completions.get(selectedWorkout.workout.date)?.fuelingCarbsPerHour || null,
                  fuelingHydration: completions.get(selectedWorkout.workout.date)?.fuelingHydration || null,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
