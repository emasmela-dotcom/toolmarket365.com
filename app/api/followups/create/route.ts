import { NextRequest, NextResponse } from "next/server";
import { createFollowUp } from "@/lib/followUpStore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userEmail, title, message, dueAt } = body;

  if (!userEmail || typeof userEmail !== "string" || !userEmail.trim()) {
    return NextResponse.json({ error: "userEmail required" }, { status: 400 });
  }
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }
  if (!dueAt || Number.isNaN(Date.parse(dueAt))) {
    return NextResponse.json({ error: "valid dueAt required" }, { status: 400 });
  }

  const followUp = createFollowUp({
    userEmail,
    title,
    message,
    dueAt,
  });

  return NextResponse.json({ success: true, followUp });
}
