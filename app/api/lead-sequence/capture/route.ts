import { NextRequest, NextResponse } from "next/server";
import {
  captureLead,
  ensureLeadSequenceWorker,
  processLeadSequences,
} from "@/lib/leadEmailSequence";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    ensureLeadSequenceWorker();
    captureLead(name, email);
    await processLeadSequences();

    return NextResponse.json({ message: "Lead captured!" });
  } catch {
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    );
  }
}
