import { NextRequest, NextResponse } from "next/server";
import { generateTitles } from "@/lib/titleOptimizer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const titles = generateTitles(
    {
      topic: body.topic,
      audience: body.audience,
      keyword: body.keyword,
      tone: body.tone,
    },
    body.count || 5
  );

  return NextResponse.json({ titles });
}
