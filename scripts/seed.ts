import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";

async function seed() {
  console.log("Setting up database tables...");

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

  console.log("Tables created successfully!");
  console.log("Visit the app to set up your race through the setup page.");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
