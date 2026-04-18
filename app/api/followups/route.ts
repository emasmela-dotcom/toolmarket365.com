import { NextRequest, NextResponse } from "next/server";
import { getFollowUps } from "@/lib/followUpStore";
import {
  ensureAutoFollowUpWorker,
  scheduleAutoFollowUp,
} from "@/lib/autoFollowUpSender";

export async function GET() {
  return NextResponse.json({ followUps: getFollowUps() });
}

/** Auto Follow-Up Sender: schedule with { email, name, message, delayMs } */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const delayMs = Number(body.delayMs);
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name : "";
  const message = typeof body.message === "string" ? body.message : "";

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  if (!message.trim()) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    return NextResponse.json({ error: "valid delayMs required" }, { status: 400 });
  }

  ensureAutoFollowUpWorker();
  const followUp = scheduleAutoFollowUp({
    email,
    name,
    message,
    delayMs,
  });

  return NextResponse.json({
    success: true,
    scheduledFor: new Date(followUp.sendAt).toISOString(),
  });
}
