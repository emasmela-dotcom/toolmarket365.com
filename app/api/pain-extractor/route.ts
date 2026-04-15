import { NextRequest, NextResponse } from "next/server";
import { extractPainPoints } from "@/lib/painExtractor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const results = extractPainPoints({
      text: String(body.text ?? ""),
    });

    return NextResponse.json({ painPoints: results });
  } catch {
    return NextResponse.json(
      { error: "Failed to extract pain points" },
      { status: 500 }
    );
  }
}
