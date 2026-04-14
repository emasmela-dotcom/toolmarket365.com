import { NextRequest, NextResponse } from "next/server";
import { getLink, incrementClicks } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const link = getLink(slug);

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  incrementClicks(slug);

  return NextResponse.json({ success: true });
}
