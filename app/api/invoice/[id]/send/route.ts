import { NextRequest, NextResponse } from "next/server";
import { getInvoiceById } from "@/lib/invoiceStore";
import { sendInvoiceEmail } from "@/lib/sendInvoice";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await sendInvoiceEmail(invoice);
  return NextResponse.json({ success: true });
}
