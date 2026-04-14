import { NextRequest, NextResponse } from "next/server";
import { generateLandingCopy } from "@/lib/landingCopy";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const copy = generateLandingCopy({
    product: body.product,
    audience: body.audience,
    problem: body.problem,
    benefit: body.benefit,
    tone: body.tone,
  });

  return NextResponse.json({ copy });
}
