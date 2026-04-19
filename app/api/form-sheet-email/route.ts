import { NextRequest, NextResponse } from "next/server";
import { runFormSheetEmailWorkflow } from "@/lib/formSheetEmailWorkflow";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    await runFormSheetEmailWorkflow({ name, email, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[form-sheet-email]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
