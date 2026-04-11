import { NextRequest, NextResponse } from "next/server";
import { generateTikTokTrends } from "@/lib/tiktokTrendFinder";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const trends = generateTikTokTrends(
    {
      niche: body.niche ?? "",
      focus: body.focus,
    },
    typeof body.count === "number" ? body.count : 6
  );

  return NextResponse.json({ trends });
}
