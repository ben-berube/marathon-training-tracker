import { config } from "dotenv";
// Load .env.local for local development
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { workouts } from "../lib/schema";
import { planData } from "../lib/plan-data";

async function seed() {
  console.log("🏃 Starting database seed...");

  const db = drizzle(sql);

  // Create tables if they don't exist
  console.log("📦 Creating tables...");
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

  // Clear existing workout data (but preserve completions via foreign key)
  console.log("🧹 Clearing existing workouts...");
  await sql`DELETE FROM completions`;
  await sql`DELETE FROM workouts`;

  // Insert all workout data
  console.log(`📝 Inserting ${planData.length} workouts...`);

  for (const workout of planData) {
    await db.insert(workouts).values({
      date: workout.date,
      dayOfWeek: workout.day,
      weekNumber: workout.weekNumber,
      milesPlanned: String(workout.milesPlanned),
      workoutType: workout.type,
      workoutDescription: workout.workout,
      isTaperWeek: workout.isTaperWeek,
      isLongRun: workout.isLongRun,
      isRaceDay: workout.isRaceDay,
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`   Total workouts: ${planData.length}`);
  console.log(
    `   Total planned miles: ${planData.reduce((sum, w) => sum + w.milesPlanned, 0).toFixed(1)}`
  );

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
