import { NextRequest, NextResponse } from "next/server";
import { critiqueLandingPage } from "@/lib/landingCritiquer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = critiqueLandingPage({
      headline: body.headline,
      subheadline: body.subheadline,
      body: body.body,
      cta: body.cta,
      audience: body.audience,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to critique landing page" },
      { status: 500 }
    );
  }
}
