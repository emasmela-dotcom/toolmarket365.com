import { NextRequest, NextResponse } from "next/server";
import { findKeywordOpportunities } from "@/lib/keywordFinder";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const results = findKeywordOpportunities({
    seed: String(body.seed ?? ""),
  });

  return NextResponse.json({ results });
}
