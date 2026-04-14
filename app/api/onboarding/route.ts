import { NextRequest, NextResponse } from "next/server";
import { generateChecklist } from "@/lib/onboarding";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const checklist = generateChecklist({
    businessType: body.businessType,
    service: body.service,
    clientType: body.clientType,
  });

  return NextResponse.json({ checklist });
}
