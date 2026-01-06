import { db } from "@/lib/db";
import { workouts, completions } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const weekNumber = searchParams.get("week");
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  try {
    let query = db
      .select({
        workout: workouts,
        completion: completions,
      })
      .from(workouts)
      .leftJoin(completions, eq(workouts.id, completions.workoutId));

    if (date) {
      // Get single workout by date
      const results = await query.where(eq(workouts.date, date));
      if (results.length === 0) {
        return NextResponse.json({ error: "Workout not found" }, { status: 404 });
      }
      return NextResponse.json(results[0]);
    }

    if (weekNumber) {
      // Get all workouts for a specific week
      const results = await query.where(eq(workouts.weekNumber, parseInt(weekNumber)));
      return NextResponse.json(results);
    }

    if (startDate && endDate) {
      // Get workouts in date range
      const results = await query.where(
        and(gte(workouts.date, startDate), lte(workouts.date, endDate))
      );
      return NextResponse.json(results);
    }

    // Get all workouts
    const results = await query.orderBy(workouts.date);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}
