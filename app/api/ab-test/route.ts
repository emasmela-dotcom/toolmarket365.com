import { NextRequest, NextResponse } from "next/server";

type Variant = "A" | "B";
type EventType = "impression" | "conversion";

let data: Record<Variant, { impressions: number; conversions: number }> = {
  A: { impressions: 0, conversions: 0 },
  B: { impressions: 0, conversions: 0 },
};

export async function GET() {
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { type, variant } = (await req.json()) as {
    type?: EventType;
    variant?: Variant;
  };

  if (!variant || !data[variant]) {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
  }

  if (type === "impression") {
    data[variant].impressions++;
  }

  if (type === "conversion") {
    data[variant].conversions++;
  }

  return NextResponse.json({ success: true, data });
}
