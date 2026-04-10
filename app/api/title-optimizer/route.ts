import { NextRequest, NextResponse } from "next/server";
import { generateTitles, type TitleInput } from "@/lib/titleOptimizer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const tones: TitleInput["tone"][] = [
    "viral",
    "educational",
    "curiosity",
    "authority",
  ];
  const tone =
    body.tone && tones.includes(body.tone) ? body.tone : undefined;

  const titles = generateTitles(
    {
      topic: body.topic,
      audience: body.audience,
      keyword: body.keyword,
      tone,
    },
    typeof body.count === "number" ? body.count : 5
  );

  return NextResponse.json({ titles });
}
