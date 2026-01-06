import { redirect } from "next/navigation";
import { planData } from "@/lib/plan-data";

// Helper to get local date string in YYYY-MM-DD format (avoids UTC timezone issues)
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function WeekIndexPage() {
  // Determine current week based on today's date
  const today = getLocalDateString();
  const todayWorkout = planData.find((w) => w.date === today);
  const currentWeek = todayWorkout?.weekNumber || 1;

  redirect(`/week/${currentWeek}`);
}
