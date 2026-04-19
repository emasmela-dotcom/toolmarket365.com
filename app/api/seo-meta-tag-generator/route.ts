import { NextRequest, NextResponse } from "next/server";
import { generateSeoMetaTags } from "@/lib/seoMetaTagGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tags = generateSeoMetaTags({
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      keywords: String(body.keywords ?? ""),
      author: String(body.author ?? ""),
      url: String(body.url ?? ""),
      image: String(body.image ?? ""),
    });

    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate SEO meta tags" },
      { status: 500 }
    );
  }
}
