import { NextRequest, NextResponse } from "next/server";
import { generateContentIdeas } from "@/lib/content-ideas";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const ideas = generateContentIdeas({
    niche: body.niche,
  });

  return NextResponse.json({ ideas });
}