import { NextRequest, NextResponse } from "next/server";
import { explainTrend } from "@/lib/trendExplainer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.trend || typeof body.trend !== "string" || !body.trend.trim()) {
    return NextResponse.json(
      { error: "Trend is required" },
      { status: 400 }
    );
  }

  try {
    const explanation = await explainTrend({
      trend: body.trend.trim(),
    });

    return NextResponse.json({ explanation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze trend";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
