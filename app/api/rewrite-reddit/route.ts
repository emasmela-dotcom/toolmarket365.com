import { NextRequest, NextResponse } from "next/server";
import { generateVariations } from "@/lib/redditRewriter";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { post, variations = 3 } = body;

  if (!post) {
    return NextResponse.json({ error: "Post is required" }, { status: 400 });
  }

  const count =
    typeof variations === "number" && variations > 0 && variations <= 10
      ? variations
      : 3;

  const rewritten = generateVariations(post, count);

  return NextResponse.json({ rewritten });
}
