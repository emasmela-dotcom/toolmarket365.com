import { NextRequest, NextResponse } from "next/server";
import { validateNiche } from "@/lib/nicheValidator";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = validateNiche({
    niche: body.niche,
    audience: body.audience,
  });

  return NextResponse.json(result);
}
