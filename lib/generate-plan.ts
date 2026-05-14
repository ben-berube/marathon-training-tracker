import { getTemplate, type TemplateWorkout } from "./plan-templates";

export interface GeneratedWorkout {
  date: string;
  dayOfWeek: string;
  weekNumber: number;
  milesPlanned: number;
  workoutType: string;
  workoutDescription: string;
  isTaperWeek: boolean;
  isLongRun: boolean;
  isRaceDay: boolean;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generate a concrete training plan from a template and race date.
 *
 * The race is always the last day of week 8 (Sunday = dayOfWeek 6).
 * Week 8 Monday is 6 days before race day. Week 1 Monday is 49 days before.
 */
export function generatePlan(
  raceDate: string,
  distance: string
): GeneratedWorkout[] {
  const template = getTemplate(distance);
  const race = new Date(raceDate + "T00:00:00");

  // Race day is the last day of week 8 (dayOfWeek=6, Sunday).
  // Week 8 Monday (dayOfWeek=0) is 6 days before race day.
  // Week 1 Monday is 7*7 = 49 days before week 8 Monday, so 55 days before race day.
  const week1Monday = addDays(race, -55);

  const plan: GeneratedWorkout[] = template.map((t: TemplateWorkout) => {
    const daysFromWeek1Monday = (t.weekNumber - 1) * 7 + t.dayOfWeek;
    const workoutDate = addDays(week1Monday, daysFromWeek1Monday);

    return {
      date: formatDate(workoutDate),
      dayOfWeek: t.dayLabel,
      weekNumber: t.weekNumber,
      milesPlanned: t.milesPlanned,
      workoutType: t.type,
      workoutDescription: t.workout,
      isTaperWeek: t.isTaperWeek,
      isLongRun: t.isLongRun,
      isRaceDay: t.isRaceDay,
    };
  });

  return plan;
}

/** Return the plan start date (week 1 Monday) for a given race date. */
export function getPlanStartDate(raceDate: string): string {
  const race = new Date(raceDate + "T00:00:00");
  return formatDate(addDays(race, -55));
}
