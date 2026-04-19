import { NextRequest, NextResponse } from "next/server";
import { repurposeContent } from "@/lib/contentRepurposer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    if (!content) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }

    const result = await repurposeContent({ content });

    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
