import { NextRequest, NextResponse } from "next/server";
import { getAgreementRecord } from "@/lib/agreements";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agreement = getAgreementRecord(id);

  if (!agreement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ agreement });
}
