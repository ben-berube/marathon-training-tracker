"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TodayHero } from "@/components/TodayHero";
import { WorkoutCard } from "@/components/WorkoutCard";
import { CompletionModal, CompletionData } from "@/components/CompletionModal";
import { WeekProgress } from "@/components/WeekProgress";
import { Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface RaceConfig {
  id: number;
  raceName: string;
  raceLocation: string;
  raceDate: string;
  distance: string;
  totalWeeks: number;
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

function getCurrentWeekNumber(
  todayStr: string,
  planStart: string,
  planEnd: string,
  allWorkouts: WorkoutWithCompletion[]
): number {
  if (todayStr < planStart) return 1;
  if (todayStr > planEnd) return 8;
  const todayWorkout = allWorkouts.find((w) => w.workout.date === todayStr);
  return todayWorkout?.workout.weekNumber || 1;
}

export default function HomePage() {
  const router = useRouter();
  const [raceConfig, setRaceConfig] = useState<RaceConfig | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutWithCompletion[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<WorkoutWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutWithCompletion | null>(null);
  const [completions, setCompletions] = useState<
    Map<string, CompletionData>
  >(new Map());

  const today = getLocalDateString();

  // Load race config first
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/race-config");
        if (res.status === 404) {
          router.push("/setup");
          return;
        }
        if (res.ok) {
          const config = await res.json();
          setRaceConfig(config);
        }
      } catch {
        // If we can't reach the API, stay on the page with loading
      }
    }
    loadConfig();
  }, [router]);

  // Load all workouts to determine current week
  useEffect(() => {
    if (!raceConfig) return;
    async function loadAll() {
      try {
        const res = await fetch("/api/workouts");
        if (res.ok) {
          const data = await res.json();
          setAllWorkouts(data);
        }
      } catch {
        // ignore
      }
    }
    loadAll();
  }, [raceConfig]);

  // Compute plan dates and current week from race config
  const planStart = allWorkouts.length > 0
    ? allWorkouts.reduce((min, w) => (w.workout.date < min ? w.workout.date : min), allWorkouts[0].workout.date)
    : "";
  const planEnd = raceConfig?.raceDate || "";
  const currentWeek = allWorkouts.length > 0
    ? getCurrentWeekNumber(today, planStart, planEnd, allWorkouts)
    : 1;

  const trainingStatus = (() => {
    if (!planStart || !planEnd) return { status: "loading" as const };
    if (today < planStart) {
      const todayDate = new Date();
      const startDate = new Date(planStart + "T00:00:00");
      const daysUntilStart = Math.ceil(
        (startDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { status: "before" as const, daysUntilStart };
    }
    if (today > planEnd) return { status: "after" as const };
    return { status: "active" as const };
  })();

  const sortByDate = (wkts: WorkoutWithCompletion[]) => {
    return [...wkts].sort(
      (a, b) =>
        new Date(a.workout.date).getTime() - new Date(b.workout.date).getTime()
    );
  };

  const loadWorkouts = useCallback(async () => {
    if (!raceConfig) return;
    try {
      const res = await fetch(`/api/workouts?week=${currentWeek}`);
      if (res.ok) {
        const data = await res.json();
        setWorkouts(sortByDate(data));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [raceConfig, currentWeek]);

  useEffect(() => {
    if (raceConfig && allWorkouts.length > 0) {
      loadWorkouts();
    }
  }, [raceConfig, allWorkouts, loadWorkouts]);

  const todayWorkout = workouts.find((w) => w.workout.date === today) || null;

  const getNextWorkout = () => {
    if (trainingStatus.status === "before") return workouts[0] || null;
    if (todayWorkout) {
      const todayIndex = workouts.findIndex((w) => w.workout.date === today);
      return todayIndex >= 0 && todayIndex < workouts.length - 1
        ? workouts[todayIndex + 1]
        : null;
    }
    return workouts.find((w) => w.workout.date > today) || null;
  };

  const nextWorkout = getNextWorkout();

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
      if (res.ok) loadWorkouts();
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

  const daysUntilRace = raceConfig
    ? Math.ceil(
        (new Date(raceConfig.raceDate + "T00:00:00").getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (loading || !raceConfig) {
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
          <h1 className="text-2xl font-bold">{raceConfig.raceName}</h1>
          <p className="text-sm text-muted">
            {raceConfig.totalWeeks}-Week Training Plan
          </p>
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
          <div className="text-4xl mb-3">&#127939;</div>
          <h2 className="text-xl font-bold mb-2">Training Starts Soon!</h2>
          <p className="text-muted mb-4">
            Your {raceConfig.totalWeeks}-week training begins on{" "}
            <span className="text-accent font-semibold">
              {new Date(planStart + "T00:00:00").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
          <div className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-full">
            <span className="font-mono text-2xl font-bold text-accent">
              {trainingStatus.daysUntilStart}
            </span>
            <span className="text-muted">days until training</span>
          </div>
        </div>
      )}

      {/* Today's Workout */}
      {trainingStatus.status === "active" && todayWorkout && (
        <TodayHero
          date={todayWorkout.workout.date}
          dayOfWeek={todayWorkout.workout.dayOfWeek}
          milesPlanned={parseFloat(todayWorkout.workout.milesPlanned)}
          workoutType={todayWorkout.workout.workoutType}
          workoutDescription={todayWorkout.workout.workoutDescription}
          weekNumber={todayWorkout.workout.weekNumber}
          isCompleted={
            todayWorkout.completion !== null ||
            completions.has(todayWorkout.workout.date)
          }
          isTaperWeek={todayWorkout.workout.isTaperWeek || false}
          isLongRun={todayWorkout.workout.isLongRun || false}
          isRaceDay={todayWorkout.workout.isRaceDay || false}
          actualMiles={
            todayWorkout.completion?.actualMiles
              ? parseFloat(todayWorkout.completion.actualMiles)
              : completions.get(todayWorkout.workout.date)?.actualMiles ||
                undefined
          }
          onLogClick={() => handleOpenModal(todayWorkout)}
        />
      )}

      {/* Up Next */}
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
            isCompleted={
              nextWorkout.completion !== null ||
              completions.has(nextWorkout.workout.date)
            }
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
                  fuelingHydration:
                    selectedWorkout.completion.fuelingHydration,
                }
              : completions.has(selectedWorkout.workout.date)
                ? {
                    actualMiles:
                      completions.get(selectedWorkout.workout.date)
                        ?.actualMiles || null,
                    durationMinutes:
                      completions.get(selectedWorkout.workout.date)
                        ?.durationMinutes || null,
                    rpe:
                      completions.get(selectedWorkout.workout.date)?.rpe ||
                      null,
                    notes:
                      completions.get(selectedWorkout.workout.date)?.notes ||
                      null,
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
