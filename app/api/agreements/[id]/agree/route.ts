import { NextRequest, NextResponse } from "next/server";
import { getAgreementRecord, markAgreementAgreed } from "@/lib/agreements";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!getAgreementRecord(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = markAgreementAgreed(id);
  if (!ok) {
    return NextResponse.json(
      { error: "Already agreed or invalid state" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
