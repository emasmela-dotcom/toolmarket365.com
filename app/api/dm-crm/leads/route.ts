import { NextResponse } from "next/server";
import { getDmLeads } from "@/lib/dmCrmCapture";

export async function GET() {
  return NextResponse.json({ leads: getDmLeads() });
}
