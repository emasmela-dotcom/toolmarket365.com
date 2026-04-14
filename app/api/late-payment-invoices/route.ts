import { NextResponse } from "next/server";
import { latePaymentInvoices } from "@/lib/latePaymentInvoices";

export async function GET() {
  return NextResponse.json({ invoices: latePaymentInvoices });
}
