import { NextRequest, NextResponse } from "next/server";
import { getLink, incrementClicks } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const link = getLink(slug);

  if (!link) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  incrementClicks(slug);

  return NextResponse.redirect(link.url);
}
