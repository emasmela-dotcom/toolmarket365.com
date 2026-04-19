import { NextRequest, NextResponse } from "next/server";
import {
  buildAutoReply,
  captureLeadFromDm,
} from "@/lib/dmCrmCapture";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingMessage =
      typeof body.message === "string" ? body.message : "";

    if (!incomingMessage.trim()) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const lead = captureLeadFromDm(incomingMessage);
    const reply = buildAutoReply(lead);

    return NextResponse.json({
      success: true,
      lead,
      reply,
    });
  } catch (err) {
    console.error("[dm-crm]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
