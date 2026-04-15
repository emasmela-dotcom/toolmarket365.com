import { NextRequest, NextResponse } from "next/server";
import { findAudience } from "@/lib/audience";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = findAudience({
    niche: body.niche,
    product: body.product,
    problem: body.problem,
  });

  return NextResponse.json({ audiences: result });
}
