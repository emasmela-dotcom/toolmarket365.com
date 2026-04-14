import { NextRequest, NextResponse } from "next/server";
import { markInvoicePaid } from "@/lib/invoiceStore";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = markInvoicePaid(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found or already paid" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
