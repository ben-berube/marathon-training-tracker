import {
  pgTable,
  serial,
  date,
  varchar,
  integer,
  decimal,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const raceConfig = pgTable("race_config", {
  id: serial("id").primaryKey(),
  raceName: varchar("race_name", { length: 100 }).notNull(),
  raceLocation: varchar("race_location", { length: 100 }).notNull(),
  raceDate: date("race_date").notNull(),
  distance: varchar("distance", { length: 20 }).notNull(),
  totalWeeks: integer("total_weeks").notNull().default(8),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RaceConfig = typeof raceConfig.$inferSelect;
export type NewRaceConfig = typeof raceConfig.$inferInsert;

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  dayOfWeek: varchar("day_of_week", { length: 3 }).notNull(),
  weekNumber: integer("week_number").notNull(),
  milesPlanned: decimal("miles_planned", { precision: 4, scale: 1 }).notNull(),
  workoutType: varchar("workout_type", { length: 20 }).notNull(),
  workoutDescription: text("workout_description").notNull(),
  isTaperWeek: boolean("is_taper_week").default(false),
  isLongRun: boolean("is_long_run").default(false),
  isRaceDay: boolean("is_race_day").default(false),
});

export const completions = pgTable("completions", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .references(() => workouts.id)
    .notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  actualMiles: decimal("actual_miles", { precision: 4, scale: 1 }),
  durationMinutes: integer("duration_minutes"),
  rpe: integer("rpe"),
  notes: text("notes"),
  fuelingCarbsPerHour: integer("fueling_carbs_per_hour"),
  fuelingHydration: text("fueling_hydration"),
});

export const workoutsRelations = relations(workouts, ({ one }) => ({
  completion: one(completions, {
    fields: [workouts.id],
    references: [completions.workoutId],
  }),
}));

export const completionsRelations = relations(completions, ({ one }) => ({
  workout: one(workouts, {
    fields: [completions.workoutId],
    references: [workouts.id],
  }),
}));

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type Completion = typeof completions.$inferSelect;
export type NewCompletion = typeof completions.$inferInsert;
