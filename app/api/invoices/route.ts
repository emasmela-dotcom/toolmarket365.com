import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/invoiceStore";

export async function GET() {
  return NextResponse.json({ invoices: getInvoices() });
}
