import { NextRequest, NextResponse } from "next/server";
import { generateHooks } from "@/lib/hooks";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const hooks = generateHooks({
    niche: body.niche,
    audience: body.audience,
    painPoint: body.painPoint,
    desire: body.desire,
  });

  return NextResponse.json({ hooks });
}