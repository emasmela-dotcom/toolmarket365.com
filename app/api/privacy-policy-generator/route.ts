import { NextRequest, NextResponse } from "next/server";
import { generatePrivacyPolicy } from "@/lib/privacyPolicyGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const policy = generatePrivacyPolicy({
      businessName: String(body.businessName ?? ""),
      website: String(body.website ?? ""),
      email: String(body.email ?? ""),
      dataCollected: String(body.dataCollected ?? ""),
    });

    return NextResponse.json({ policy });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate privacy policy" },
      { status: 500 }
    );
  }
}
