// Parsed workout plan data from sf_marathon_training_plan_2026.md
// 8-week plan from Jan 5, 2026 to Mar 1, 2026 (race day)

export interface WorkoutData {
  date: string;
  day: string;
  milesPlanned: number;
  type: string;
  workout: string;
  weekNumber: number;
  isTaperWeek: boolean;
  isLongRun: boolean;
  isRaceDay: boolean;
}

// Week date ranges for calculating week numbers
const weekRanges = [
  { start: "2026-01-05", end: "2026-01-11", week: 1 },
  { start: "2026-01-12", end: "2026-01-18", week: 2 },
  { start: "2026-01-19", end: "2026-01-25", week: 3 },
  { start: "2026-01-26", end: "2026-02-01", week: 4 },
  { start: "2026-02-02", end: "2026-02-08", week: 5 },
  { start: "2026-02-09", end: "2026-02-15", week: 6 }, // Taper starts
  { start: "2026-02-16", end: "2026-02-22", week: 7 }, // Taper
  { start: "2026-02-23", end: "2026-03-01", week: 8 }, // Race week
];

function getWeekNumber(dateStr: string): number {
  for (const range of weekRanges) {
    if (dateStr >= range.start && dateStr <= range.end) {
      return range.week;
    }
  }
  return 0;
}

function isTaperWeek(weekNum: number): boolean {
  return weekNum >= 6;
}

function isLongRun(day: string, miles: number): boolean {
  return day === "Sun" && miles >= 14;
}

export const planData: WorkoutData[] = [
  // Week 1 (Jan 5-11) - Long run 14 mi
  {
    date: "2026-01-05",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + 15–25 min mobility (hips/calves)",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-06",
    day: "Tue",
    milesPlanned: 5,
    type: "Hills",
    workout: "WU, 6×60 sec uphill (strong effort), easy jog down, CD",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-07",
    day: "Wed",
    milesPlanned: 4,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-08",
    day: "Thu",
    milesPlanned: 6,
    type: "MP",
    workout: "2 E + 3 at MP + 1 E",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-09",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest/XT",
    workout: "Rest or XT 30–45 min easy",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-10",
    day: "Sat",
    milesPlanned: 4,
    type: "Easy+Strides",
    workout: "Easy + 4–6 strides",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-11",
    day: "Sun",
    milesPlanned: 14,
    type: "Long",
    workout: "Long run E",
    weekNumber: 1,
    isTaperWeek: false,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 2 (Jan 12-18) - Long run 15 mi
  {
    date: "2026-01-12",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + strength 20–30 min",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-13",
    day: "Tue",
    milesPlanned: 6,
    type: "Intervals",
    workout: "WU, 5×800m (10K-ish) w/ equal easy jog, CD",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-14",
    day: "Wed",
    milesPlanned: 5,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-15",
    day: "Thu",
    milesPlanned: 7,
    type: "Steady/MP",
    workout: "Mostly E, finish with 2 mi at MP",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-16",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest/XT",
    workout: "Rest or XT 30–45 min easy",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-17",
    day: "Sat",
    milesPlanned: 4,
    type: "Easy+Strides",
    workout: "Easy + 4–6 strides",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-18",
    day: "Sun",
    milesPlanned: 15,
    type: "Long",
    workout: "Long run E",
    weekNumber: 2,
    isTaperWeek: false,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 3 (Jan 19-25) - Long run 16 mi
  {
    date: "2026-01-19",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + strength 20–30 min",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-20",
    day: "Tue",
    milesPlanned: 6,
    type: "Hills",
    workout: "WU, 5×2 min uphill (strong but controlled), jog down, CD",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-21",
    day: "Wed",
    milesPlanned: 5,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-22",
    day: "Thu",
    milesPlanned: 8,
    type: "Tempo",
    workout: "2 E + 4 mi T + 2 E",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-23",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest/XT",
    workout: "Rest or XT easy",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-24",
    day: "Sat",
    milesPlanned: 5,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-25",
    day: "Sun",
    milesPlanned: 16,
    type: "Long",
    workout: "Long run E (last 2 mi steady if feeling good)",
    weekNumber: 3,
    isTaperWeek: false,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 4 (Jan 26 - Feb 1) - Long run 18 mi
  {
    date: "2026-01-26",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + mobility + light strength",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-27",
    day: "Tue",
    milesPlanned: 7,
    type: "Intervals",
    workout: "WU, 3×1 mile (10K-ish) w/ 3 min easy jog, CD",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-28",
    day: "Wed",
    milesPlanned: 5,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-29",
    day: "Thu",
    milesPlanned: 9,
    type: "MP",
    workout: "2 E + 5 at MP (split 3+2 ok) + 2 E",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-30",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest/XT",
    workout: "Rest or XT easy",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-01-31",
    day: "Sat",
    milesPlanned: 4,
    type: "Easy+Strides",
    workout: "Easy + strides",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-01",
    day: "Sun",
    milesPlanned: 18,
    type: "Long",
    workout: "Long run E (practice fueling)",
    weekNumber: 4,
    isTaperWeek: false,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 5 (Feb 2-8) - Peak long run 20 mi
  {
    date: "2026-02-02",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest (prioritize sleep)",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-03",
    day: "Tue",
    milesPlanned: 7,
    type: "Hills",
    workout: "WU, 8×60 sec uphill, jog down, CD",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-04",
    day: "Wed",
    milesPlanned: 6,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-05",
    day: "Thu",
    milesPlanned: 8,
    type: "MP",
    workout: "2 E + 5 at MP + 1 E",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-06",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest/XT",
    workout: "Rest or XT easy",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-07",
    day: "Sat",
    milesPlanned: 4,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-08",
    day: "Sun",
    milesPlanned: 20,
    type: "Long",
    workout: "20 mi long E; optional last 3–4 mi at MP if smooth",
    weekNumber: 5,
    isTaperWeek: false,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 6 (Feb 9-15) - Taper begins, long run 14 mi
  {
    date: "2026-02-09",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + mobility",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-10",
    day: "Tue",
    milesPlanned: 6,
    type: "Speed",
    workout: "WU, 6×400m (5K-ish) w/ easy jog, CD",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-11",
    day: "Wed",
    milesPlanned: 5,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-12",
    day: "Thu",
    milesPlanned: 7,
    type: "MP",
    workout: "2 E + 3 at MP + 2 E",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-13",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-14",
    day: "Sat",
    milesPlanned: 4,
    type: "Easy+Strides",
    workout: "Easy + strides",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-15",
    day: "Sun",
    milesPlanned: 14,
    type: "Long",
    workout: "Long run E",
    weekNumber: 6,
    isTaperWeek: true,
    isLongRun: true,
    isRaceDay: false,
  },

  // Week 7 (Feb 16-22) - Taper, long run 10 mi
  {
    date: "2026-02-16",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest + very light strength (optional)",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-17",
    day: "Tue",
    milesPlanned: 5,
    type: "Intervals",
    workout: "WU, 3×1K (10K-ish) w/ easy jog, CD",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-18",
    day: "Wed",
    milesPlanned: 4,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-19",
    day: "Thu",
    milesPlanned: 6,
    type: "MP",
    workout: "2 E + 2–3 at MP + E to finish",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-20",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-21",
    day: "Sat",
    milesPlanned: 3,
    type: "Easy+Strides",
    workout: "Easy + 4 strides",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-22",
    day: "Sun",
    milesPlanned: 10,
    type: "Long",
    workout: "10 mi long E",
    weekNumber: 7,
    isTaperWeek: true,
    isLongRun: false, // Not >= 14 miles
    isRaceDay: false,
  },

  // Week 8 (Feb 23 - Mar 1) - Race week
  {
    date: "2026-02-23",
    day: "Mon",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest (or optional 3 mi E)",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-24",
    day: "Tue",
    milesPlanned: 5,
    type: "Easy+Strides",
    workout: "5 mi E + 6×20 sec strides",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-25",
    day: "Wed",
    milesPlanned: 4,
    type: "Easy",
    workout: "Easy run",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-26",
    day: "Thu",
    milesPlanned: 3,
    type: "Sharpen",
    workout: "3 mi E with 2×5 min at MP (easy between)",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-27",
    day: "Fri",
    milesPlanned: 0,
    type: "Rest",
    workout: "Rest",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-02-28",
    day: "Sat",
    milesPlanned: 2,
    type: "Shakeout",
    workout: "2 mi very easy + 4 short strides (or full rest)",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: false,
  },
  {
    date: "2026-03-01",
    day: "Sun",
    milesPlanned: 26.2,
    type: "Race",
    workout: "Marathon race day",
    weekNumber: 8,
    isTaperWeek: true,
    isLongRun: false,
    isRaceDay: true,
  },
];

// Helper functions for working with the plan data
export function getWorkoutByDate(dateStr: string): WorkoutData | undefined {
  return planData.find((w) => w.date === dateStr);
}

export function getWorkoutsByWeek(weekNum: number): WorkoutData[] {
  return planData.filter((w) => w.weekNumber === weekNum);
}

export function getTotalPlannedMiles(): number {
  return planData.reduce((sum, w) => sum + w.milesPlanned, 0);
}

export function getWeeklyPlannedMiles(weekNum: number): number {
  return getWorkoutsByWeek(weekNum).reduce((sum, w) => sum + w.milesPlanned, 0);
}

// Workout type to color mapping (for UI)
// Returns hex color values for inline styles (Tailwind JIT doesn't support dynamic class names)
export function getWorkoutTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    Hills: "#ef4444",      // red
    Intervals: "#8b5cf6",  // purple
    MP: "#3b82f6",         // blue
    "Steady/MP": "#3b82f6",
    Tempo: "#06b6d4",      // cyan
    Speed: "#8b5cf6",
    Sharpen: "#3b82f6",
    Easy: "#6b7280",       // gray
    "Easy+Strides": "#6b7280",
    Long: "#f97316",       // orange
    Rest: "#404040",       // dark gray
    "Rest/XT": "#404040",
    Shakeout: "#6b7280",
    Race: "#fbbf24",       // yellow/gold
  };
  return typeColors[type] || "#6b7280";
}

// Per-workout nutrition tips based on workout type and distance
export interface NutritionTip {
  tip: string;
  details: string;
  icon: "fuel" | "water" | "rest" | "carbs";
}

export function getWorkoutNutritionTip(
  workoutType: string,
  milesPlanned: number,
  isLongRun: boolean,
  isRaceDay: boolean
): NutritionTip | null {
  // Race day has special nutrition
  if (isRaceDay) {
    return {
      tip: "Race Day Fueling",
      details: "Breakfast 3-4hrs before (300-400 cal). Gel 15 min before start. During race: 40-60g carbs/hr.",
      icon: "carbs",
    };
  }
  
  // Long runs (14+ miles)
  if (isLongRun || milesPlanned >= 14) {
    return {
      tip: "Pre-load & Fuel During",
      details: "Extra carbs tonight. Eat 2-3hrs before. Bring gels: aim for 40-60g carbs/hr after mile 6.",
      icon: "fuel",
    };
  }
  
  // Tempo/MP/Speed workouts
  if (["Tempo", "MP", "Steady/MP", "Intervals", "Speed", "Hills", "Sharpen"].includes(workoutType)) {
    return {
      tip: "Light Pre-Run Fuel",
      details: "Easy meal 2-3hrs before (toast, banana). Have water available. Save heavy eating for after.",
      icon: "water",
    };
  }
  
  // Rest days
  if (workoutType === "Rest" || workoutType === "Rest/XT") {
    return {
      tip: "Recovery Nutrition",
      details: "Focus on protein for muscle repair. Stay hydrated. Good day for meal prep!",
      icon: "rest",
    };
  }
  
  // Easy/Shakeout runs - no special tip needed
  if (milesPlanned <= 5) {
    return null;
  }
  
  // Medium easy runs
  return {
    tip: "Stay Hydrated",
    details: "Normal eating. Have water before and after. No special fueling needed.",
    icon: "water",
  };
}
