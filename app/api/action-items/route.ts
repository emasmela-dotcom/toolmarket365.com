import { NextRequest, NextResponse } from "next/server";
import { extractActionItems } from "@/lib/actionItems";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.text || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "Missing meeting text" },
        { status: 400 }
      );
    }

    const result = await extractActionItems(body.text);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
