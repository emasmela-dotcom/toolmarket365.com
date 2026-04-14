import { NextRequest, NextResponse } from "next/server";
import { optimizeCheckout } from "@/lib/checkoutOptimizer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = optimizeCheckout({
    productName: body.productName,
    price: Number(body.price),
    billingType: body.billingType,
    ctaText: body.ctaText,
    trustSignals: body.trustSignals || [],
    frictionPoints: body.frictionPoints || [],
    features: body.features || [],
  });

  return NextResponse.json(result);
}
