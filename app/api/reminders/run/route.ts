import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminderEngine";

export async function GET() {
  await runReminders();
  return NextResponse.json({ success: true });
}
