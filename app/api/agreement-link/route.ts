import { NextRequest, NextResponse } from "next/server";
import { createAgreementRecord } from "@/lib/agreements";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = typeof body.title === "string" ? body.title : "";
  if (!title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const rec = createAgreementRecord({
    title,
    description: typeof body.description === "string" ? body.description : "",
    amount: typeof body.amount === "string" ? body.amount : "",
    dueAt: typeof body.dueAt === "string" ? body.dueAt : "",
  });

  const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = envBase || new URL(req.url).origin;

  const link = `${origin}/agreements/${rec.id}`;

  return NextResponse.json({ link, id: rec.id });
}
