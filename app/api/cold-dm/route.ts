import { NextRequest, NextResponse } from "next/server";
import { generateColdDMs, type ColdDMInput } from "@/lib/coldDM";

const platforms: ColdDMInput["platform"][] = [
  "twitter",
  "instagram",
  "linkedin",
  "email",
];

const tones: NonNullable<ColdDMInput["tone"]>[] = [
  "casual",
  "professional",
  "friendly",
  "direct",
];

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.niche || !body.target || !body.goal) {
    return NextResponse.json(
      { error: "niche, target, and goal are required" },
      { status: 400 }
    );
  }

  const platform = platforms.includes(body.platform)
    ? body.platform
    : "linkedin";

  const tone =
    body.tone && tones.includes(body.tone) ? body.tone : undefined;

  const dms = generateColdDMs({
    niche: String(body.niche),
    target: String(body.target),
    platform,
    tone,
    goal: String(body.goal),
  });

  return NextResponse.json({ dms });
}
