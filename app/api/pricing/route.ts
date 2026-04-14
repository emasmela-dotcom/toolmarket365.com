import { NextRequest, NextResponse } from "next/server";
import { calculateOptimalPrice } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = calculateOptimalPrice({
    cost: Number(body.cost),
    desiredMargin: Number(body.margin),
    competitorPrices: body.competitors || [],
    perceivedValue: Number(body.value),
    demandMultiplier: Number(body.demand || 1),
  });

  return NextResponse.json(result);
}
