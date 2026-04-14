import { NextRequest, NextResponse } from "next/server";
import { createLink, getAllLinks } from "@/lib/store";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ links: getAllLinks() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  const slug = generateSlug();

  const link = createLink({
    id: crypto.randomUUID(),
    slug,
    url: body.url,
    title: body.title || "",
    clicks: 0,
    createdAt: Date.now(),
  });

  return NextResponse.json({ link });
}
