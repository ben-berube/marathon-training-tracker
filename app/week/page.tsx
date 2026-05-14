"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function WeekIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function determineWeek() {
      try {
        const res = await fetch("/api/workouts");
        if (!res.ok) {
          router.replace("/week/1");
          return;
        }
        const data = await res.json();
        const today = getLocalDateString();
        const todayWorkout = data.find(
          (w: { workout: { date: string } }) => w.workout.date === today
        );
        const currentWeek = todayWorkout?.workout?.weekNumber || 1;
        router.replace(`/week/${currentWeek}`);
      } catch {
        router.replace("/week/1");
      }
    }
    determineWeek();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted">Loading...</div>
    </div>
  );
}
