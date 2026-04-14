import { NextRequest, NextResponse } from "next/server";
import { createInvoice } from "@/lib/invoiceStore";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const amount = Number(body.amount);
  if (Number.isNaN(amount) || amount < 0) {
    return NextResponse.json({ error: "Valid amount required" }, { status: 400 });
  }

  if (!body.clientEmail || typeof body.clientEmail !== "string") {
    return NextResponse.json({ error: "Client email required" }, { status: 400 });
  }

  const invoice = createInvoice({
    clientEmail: body.clientEmail,
    clientName: typeof body.clientName === "string" ? body.clientName : "",
    amount,
    description: typeof body.description === "string" ? body.description : "",
    dueDate: typeof body.dueDate === "string" ? body.dueDate : "",
  });

  return NextResponse.json({ invoice });
}
