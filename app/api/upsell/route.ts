import { NextRequest, NextResponse } from "next/server";
import { generateUpsells } from "@/lib/upsell";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upsells = generateUpsells({
    product: body.product,
    audience: body.audience,
    goal: body.goal,
  });

  return NextResponse.json({ upsells });
}
