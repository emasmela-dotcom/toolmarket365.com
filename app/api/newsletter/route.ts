import { NextRequest, NextResponse } from "next/server";
import { generateNewsletterTopics } from "@/lib/newsletter";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const topics = generateNewsletterTopics({
    niche: body.niche,
    audience: body.audience,
    goal: body.goal,
  });

  return NextResponse.json({ topics });
}
