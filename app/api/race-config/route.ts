import { db } from "@/lib/db";
import { raceConfig } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const configs = await db.select().from(raceConfig).limit(1);

    if (configs.length === 0) {
      return NextResponse.json(
        { error: "No race configured" },
        { status: 404 }
      );
    }

    return NextResponse.json(configs[0]);
  } catch (error: unknown) {
    // Table doesn't exist yet -- treat as "no race configured"
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("does not exist") || message.includes("relation")) {
      return NextResponse.json(
        { error: "No race configured" },
        { status: 404 }
      );
    }
    console.error("Error fetching race config:", error);
    return NextResponse.json(
      { error: "Failed to fetch race config" },
      { status: 500 }
    );
  }
}
