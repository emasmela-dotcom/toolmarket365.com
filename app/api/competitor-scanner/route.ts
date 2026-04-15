import { NextRequest, NextResponse } from "next/server";
import { analyzeCompetitors } from "@/lib/competitorScanner";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const raw = Array.isArray(body.competitors) ? body.competitors : [];
  const competitors = raw
    .map((c: string) => String(c).trim())
    .filter(Boolean);

  const result = analyzeCompetitors({
    niche: String(body.niche ?? ""),
    competitors,
  });

  return NextResponse.json({ result });
}
