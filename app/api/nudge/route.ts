import { NextResponse } from "next/server";
import { runLatePaymentNudger } from "@/lib/latePaymentNudger";

export async function GET() {
  await runLatePaymentNudger();

  return NextResponse.json({
    success: true,
    message: "Late payment nudger executed",
  });
}
