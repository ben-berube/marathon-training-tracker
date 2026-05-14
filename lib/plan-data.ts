// Workout type color mapping and nutrition tips.
// Used by TodayHero and other components -- race-agnostic utilities.

export function getWorkoutTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    Hills: "#ef4444",
    Intervals: "#8b5cf6",
    MP: "#3b82f6",
    "Steady/MP": "#3b82f6",
    Tempo: "#06b6d4",
    Speed: "#8b5cf6",
    Sharpen: "#3b82f6",
    Easy: "#6b7280",
    "Easy+Strides": "#6b7280",
    Long: "#f97316",
    Rest: "#404040",
    "Rest/XT": "#404040",
    Shakeout: "#6b7280",
    Race: "#fbbf24",
  };
  return typeColors[type] || "#6b7280";
}

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
  if (isRaceDay) {
    return {
      tip: "Race Day Fueling",
      details:
        "Breakfast 3-4hrs before (300-400 cal). Gel 15 min before start. During race: 40-60g carbs/hr.",
      icon: "carbs",
    };
  }

  if (isLongRun || milesPlanned >= 12) {
    return {
      tip: "Pre-load & Fuel During",
      details:
        "Extra carbs tonight. Eat 2-3hrs before. Bring gels: aim for 40-60g carbs/hr after mile 6.",
      icon: "fuel",
    };
  }

  if (
    [
      "Tempo",
      "MP",
      "Steady/MP",
      "Intervals",
      "Speed",
      "Hills",
      "Sharpen",
    ].includes(workoutType)
  ) {
    return {
      tip: "Light Pre-Run Fuel",
      details:
        "Easy meal 2-3hrs before (toast, banana). Have water available. Save heavy eating for after.",
      icon: "water",
    };
  }

  if (workoutType === "Rest" || workoutType === "Rest/XT") {
    return {
      tip: "Recovery Nutrition",
      details:
        "Focus on protein for muscle repair. Stay hydrated. Good day for meal prep!",
      icon: "rest",
    };
  }

  if (milesPlanned <= 5) {
    return null;
  }

  return {
    tip: "Stay Hydrated",
    details:
      "Normal eating. Have water before and after. No special fueling needed.",
    icon: "water",
  };
}
