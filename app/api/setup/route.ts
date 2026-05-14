import { sql } from "@vercel/postgres";
import { db } from "@/lib/db";
import { raceConfig, workouts, completions } from "@/lib/schema";
import { generatePlan } from "@/lib/generate-plan";
import { NextResponse } from "next/server";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS race_config (
      id SERIAL PRIMARY KEY,
      race_name VARCHAR(100) NOT NULL,
      race_location VARCHAR(100) NOT NULL,
      race_date DATE NOT NULL,
      distance VARCHAR(20) NOT NULL,
      total_weeks INT NOT NULL DEFAULT 8,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS workouts (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL UNIQUE,
      day_of_week VARCHAR(3) NOT NULL,
      week_number INT NOT NULL,
      miles_planned DECIMAL(4,1) NOT NULL,
      workout_type VARCHAR(20) NOT NULL,
      workout_description TEXT NOT NULL,
      is_taper_week BOOLEAN DEFAULT FALSE,
      is_long_run BOOLEAN DEFAULT FALSE,
      is_race_day BOOLEAN DEFAULT FALSE
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS completions (
      id SERIAL PRIMARY KEY,
      workout_id INT REFERENCES workouts(id),
      completed_at TIMESTAMP DEFAULT NOW(),
      actual_miles DECIMAL(4,1),
      duration_minutes INT,
      rpe INT CHECK (rpe >= 1 AND rpe <= 10),
      notes TEXT,
      fueling_carbs_per_hour INT,
      fueling_hydration TEXT
    )
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { raceName, raceLocation, raceDate, distance } = body;

    if (!raceName || !raceLocation || !raceDate || !distance) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["full", "half"].includes(distance)) {
      return NextResponse.json(
        { error: "Distance must be 'full' or 'half'" },
        { status: 400 }
      );
    }

    // Create tables if first time
    await ensureTables();

    // Clear existing data
    await db.delete(completions);
    await db.delete(workouts);
    await db.delete(raceConfig);

    // Insert race config
    const [config] = await db
      .insert(raceConfig)
      .values({
        raceName,
        raceLocation,
        raceDate,
        distance,
        totalWeeks: 8,
      })
      .returning();

    // Generate and insert plan
    const plan = generatePlan(raceDate, distance);

    for (const workout of plan) {
      await db.insert(workouts).values({
        date: workout.date,
        dayOfWeek: workout.dayOfWeek,
        weekNumber: workout.weekNumber,
        milesPlanned: String(workout.milesPlanned),
        workoutType: workout.workoutType,
        workoutDescription: workout.workoutDescription,
        isTaperWeek: workout.isTaperWeek,
        isLongRun: workout.isLongRun,
        isRaceDay: workout.isRaceDay,
      });
    }

    return NextResponse.json(
      { success: true, config, workoutsCreated: plan.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error setting up race:", error);
    return NextResponse.json(
      { error: "Failed to set up race" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await db.delete(completions);
    await db.delete(workouts);
    await db.delete(raceConfig);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting:", error);
    return NextResponse.json(
      { error: "Failed to reset" },
      { status: 500 }
    );
  }
}
