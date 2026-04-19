import { NextRequest, NextResponse } from "next/server";
import { analyzeSpeed } from "@/lib/speedExplainer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const report = analyzeSpeed({
    url: body.url,
    loadTime: body.loadTime,
    imageSizeMB: body.imageSizeMB,
    numRequests: body.numRequests,
    usesCDN: body.usesCDN,
    renderBlocking: body.renderBlocking,
  });

  return NextResponse.json({ report });
}
