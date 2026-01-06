import { db } from "@/lib/db";
import { completions, workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workoutId,
      actualMiles,
      durationMinutes,
      rpe,
      notes,
      fuelingCarbsPerHour,
      fuelingHydration,
    } = body;

    if (!workoutId) {
      return NextResponse.json({ error: "workoutId is required" }, { status: 400 });
    }

    // Check if completion already exists for this workout
    const existing = await db
      .select()
      .from(completions)
      .where(eq(completions.workoutId, workoutId));

    if (existing.length > 0) {
      // Update existing completion
      const [updated] = await db
        .update(completions)
        .set({
          actualMiles: actualMiles?.toString(),
          durationMinutes,
          rpe,
          notes,
          fuelingCarbsPerHour,
          fuelingHydration,
          completedAt: new Date(),
        })
        .where(eq(completions.workoutId, workoutId))
        .returning();

      return NextResponse.json(updated);
    }

    // Create new completion
    const [newCompletion] = await db
      .insert(completions)
      .values({
        workoutId,
        actualMiles: actualMiles?.toString(),
        durationMinutes,
        rpe,
        notes,
        fuelingCarbsPerHour,
        fuelingHydration,
      })
      .returning();

    return NextResponse.json(newCompletion, { status: 201 });
  } catch (error) {
    console.error("Error creating completion:", error);
    return NextResponse.json({ error: "Failed to create completion" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const workoutId = searchParams.get("workoutId");

  if (!workoutId) {
    return NextResponse.json({ error: "workoutId is required" }, { status: 400 });
  }

  try {
    await db
      .delete(completions)
      .where(eq(completions.workoutId, parseInt(workoutId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting completion:", error);
    return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
  }
}
