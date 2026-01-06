"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame, TrendingUp, Target, Footprints } from "lucide-react";
import { planData, getTotalPlannedMiles, getWeeklyPlannedMiles } from "@/lib/plan-data";

interface WeeklyStat {
  week: number;
  plannedMiles: number;
  actualMiles: number;
  workoutsPlanned: number;
  workoutsCompleted: number;
  isTaperWeek: boolean;
}

interface LongRun {
  date: string;
  plannedMiles: number;
  actualMiles: number | null;
  completed: boolean;
}

interface StatsData {
  totalPlannedMiles: number;
  totalActualMiles: number;
  workoutsCompleted: number;
  workoutsTotal: number;
  currentStreak: number;
  weeklyStats: WeeklyStat[];
  longRuns: LongRun[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // Use local mock data
          const weeklyStats: WeeklyStat[] = [];
          for (let week = 1; week <= 8; week++) {
            weeklyStats.push({
              week,
              plannedMiles: getWeeklyPlannedMiles(week),
              actualMiles: 0,
              workoutsPlanned: 7,
              workoutsCompleted: 0,
              isTaperWeek: week >= 6,
            });
          }

          const longRuns = planData
            .filter((w) => w.isLongRun || w.isRaceDay)
            .map((w) => ({
              date: w.date,
              plannedMiles: w.milesPlanned,
              actualMiles: null,
              completed: false,
            }));

          setStats({
            totalPlannedMiles: getTotalPlannedMiles(),
            totalActualMiles: 0,
            workoutsCompleted: 0,
            workoutsTotal: 0,
            currentStreak: 0,
            weeklyStats,
            longRuns,
          });
        }
      } catch {
        // Use local mock data on error
        const weeklyStats: WeeklyStat[] = [];
        for (let week = 1; week <= 8; week++) {
          weeklyStats.push({
            week,
            plannedMiles: getWeeklyPlannedMiles(week),
            actualMiles: 0,
            workoutsPlanned: 7,
            workoutsCompleted: 0,
            isTaperWeek: week >= 6,
          });
        }

        const longRuns = planData
          .filter((w) => w.isLongRun || w.isRaceDay)
          .map((w) => ({
            date: w.date,
            plannedMiles: w.milesPlanned,
            actualMiles: null,
            completed: false,
          }));

        setStats({
          totalPlannedMiles: getTotalPlannedMiles(),
          totalActualMiles: 0,
          workoutsCompleted: 0,
          workoutsTotal: 0,
          currentStreak: 0,
          weeklyStats,
          longRuns,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  const completionPercent =
    stats.totalPlannedMiles > 0
      ? (stats.totalActualMiles / stats.totalPlannedMiles) * 100
      : 0;

  const maxWeekMiles = Math.max(...stats.weeklyStats.map((w) => w.plannedMiles));

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold">Training Stats</h1>
        <p className="text-sm text-muted">8-Week Marathon Preparation</p>
      </header>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Footprints className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Total Miles</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold text-success">
              {stats.totalActualMiles.toFixed(0)}
            </span>
            <span className="text-sm text-muted">
              / {stats.totalPlannedMiles.toFixed(0)}
            </span>
          </div>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${Math.min(completionPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Workouts</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold">
              {stats.workoutsCompleted}
            </span>
            <span className="text-sm text-muted">/ {stats.workoutsTotal}</span>
          </div>
          <p className="text-xs text-muted mt-2">
            {stats.workoutsTotal > 0
              ? ((stats.workoutsCompleted / stats.workoutsTotal) * 100).toFixed(0)
              : 0}
            % completion rate
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold text-accent">
              {stats.currentStreak}
            </span>
            <span className="text-sm text-muted">days</span>
          </div>
          <p className="text-xs text-muted mt-2">Current run streak</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Race Day</span>
          </div>
          <p className="font-mono text-xl font-bold">Mar 1</p>
          <p className="text-xs text-muted mt-2">Napa Valley Marathon 2026</p>
        </div>
      </div>

      {/* Weekly Mileage Chart */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Weekly Mileage
        </h2>

        <div className="space-y-3">
          {stats.weeklyStats.map((week) => {
            const plannedPercent = (week.plannedMiles / maxWeekMiles) * 100;
            const actualPercent = (week.actualMiles / maxWeekMiles) * 100;

            return (
              <div key={week.week} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={week.isTaperWeek ? "text-warning" : ""}>
                    Week {week.week}
                    {week.isTaperWeek && " (Taper)"}
                  </span>
                  <span className="font-mono">
                    <span className="text-success">{week.actualMiles.toFixed(0)}</span>
                    <span className="text-muted"> / {week.plannedMiles.toFixed(0)} mi</span>
                  </span>
                </div>
                <div className="relative h-4 bg-background rounded-full overflow-hidden">
                  {/* Planned bar (background) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-muted/30 rounded-full"
                    style={{ width: `${plannedPercent}%` }}
                  />
                  {/* Actual bar (foreground) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all"
                    style={{ width: `${actualPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Long Run Progression */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-type-long" />
          Long Run Progression
        </h2>

        <div className="flex items-end gap-2 h-32">
          {stats.longRuns.map((run, i) => {
            const heightPercent = (run.plannedMiles / 26.2) * 100;
            const actualHeightPercent = run.actualMiles
              ? (run.actualMiles / 26.2) * 100
              : 0;
            const date = new Date(run.date + "T00:00:00").toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric" }
            );

            return (
              <div
                key={run.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="relative w-full flex-1 flex items-end">
                  {/* Planned height */}
                  <div
                    className="w-full bg-muted/30 rounded-t relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Actual height overlay */}
                    {run.completed && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-success rounded-t"
                        style={{ height: `${(actualHeightPercent / heightPercent) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xs font-bold">
                    {run.plannedMiles}
                  </p>
                  <p className="text-[10px] text-muted">{date}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted/30 rounded" />
            <span className="text-muted">Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded" />
            <span className="text-muted">Completed</span>
          </div>
        </div>
      </div>

      {/* Training Tips */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h2 className="font-medium mb-3">Training Tips</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            Easy runs should be truly easy — most miles at conversational pace
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            For long runs 90+ min: aim for 30-60g carbs/hour
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            Taper isn't losing fitness — it's shedding fatigue
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            Race strategy: conservative through mile 18, then press if you feel good
          </li>
        </ul>
      </div>
    </div>
  );
}
