import { db } from "@/lib/db";
import { workouts, completions, raceConfig } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch race config for dynamic week count and taper start
    const configs = await db.select().from(raceConfig).limit(1);
    const config = configs[0];
    const totalWeeks = config?.totalWeeks || 8;
    // Taper starts at roughly 75% through the plan
    const taperStart = Math.ceil(totalWeeks * 0.75) + 1;

    const allWorkouts = await db
      .select({
        workout: workouts,
        completion: completions,
      })
      .from(workouts)
      .leftJoin(completions, eq(workouts.id, completions.workoutId))
      .orderBy(workouts.date);

    const today = new Date().toISOString().split("T")[0];
    const pastWorkouts = allWorkouts.filter((w) => w.workout.date <= today);
    const completedWorkouts = pastWorkouts.filter(
      (w) => w.completion !== null
    );

    // Weekly stats -- dynamic week count
    const weeklyStats = [];
    for (let week = 1; week <= totalWeeks; week++) {
      const weekWorkouts = allWorkouts.filter(
        (w) => w.workout.weekNumber === week
      );
      const weekCompleted = weekWorkouts.filter(
        (w) => w.completion !== null
      );

      const plannedMiles = weekWorkouts.reduce(
        (sum, w) => sum + parseFloat(w.workout.milesPlanned),
        0
      );
      const actualMiles = weekCompleted.reduce(
        (sum, w) =>
          sum +
          (w.completion?.actualMiles
            ? parseFloat(w.completion.actualMiles)
            : 0),
        0
      );

      weeklyStats.push({
        week,
        plannedMiles,
        actualMiles,
        workoutsPlanned: weekWorkouts.length,
        workoutsCompleted: weekCompleted.length,
        isTaperWeek: week >= taperStart,
      });
    }

    // Calculate streak
    let currentStreak = 0;
    const sortedPast = [...pastWorkouts].sort(
      (a, b) =>
        new Date(b.workout.date).getTime() -
        new Date(a.workout.date).getTime()
    );

    for (const workout of sortedPast) {
      if (
        workout.workout.workoutType === "Rest" ||
        workout.workout.workoutType === "Rest/XT"
      ) {
        continue;
      }
      if (workout.completion) {
        currentStreak++;
      } else {
        break;
      }
    }

    const totalPlannedMiles = allWorkouts.reduce(
      (sum, w) => sum + parseFloat(w.workout.milesPlanned),
      0
    );
    const totalActualMiles = completedWorkouts.reduce(
      (sum, w) =>
        sum +
        (w.completion?.actualMiles
          ? parseFloat(w.completion.actualMiles)
          : 0),
      0
    );

    const longRuns = allWorkouts
      .filter((w) => w.workout.isLongRun || w.workout.isRaceDay)
      .map((w) => ({
        date: w.workout.date,
        plannedMiles: parseFloat(w.workout.milesPlanned),
        actualMiles: w.completion?.actualMiles
          ? parseFloat(w.completion.actualMiles)
          : null,
        completed: w.completion !== null,
      }));

    return NextResponse.json({
      totalPlannedMiles,
      totalActualMiles,
      workoutsCompleted: completedWorkouts.length,
      workoutsTotal: pastWorkouts.length,
      currentStreak,
      weeklyStats,
      longRuns,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
