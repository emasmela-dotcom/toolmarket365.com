import { NextResponse } from "next/server";
import {
  getDueUnsentFollowUps,
  markFollowUpSent,
} from "@/lib/followUpStore";
import { sendFollowUpReminderForRecord } from "@/lib/followUpEmail";

export async function GET() {
  const dueFollowUps = getDueUnsentFollowUps();

  for (const item of dueFollowUps) {
    await sendFollowUpReminderForRecord(item);
    markFollowUpSent(item.id);
  }

  return NextResponse.json({
    success: true,
    sent: dueFollowUps.length,
  });
}
