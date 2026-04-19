import { NextRequest, NextResponse } from "next/server";
import {
  ensureTweetSchedulerWorker,
  processDueTweets,
  scheduleTweet,
} from "@/lib/autoTweetScheduler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const postAt = typeof body.postAt === "string" ? body.postAt.trim() : "";

    if (!text || !postAt) {
      return NextResponse.json(
        { error: "Missing text or postAt" },
        { status: 400 }
      );
    }

    const t = Date.parse(postAt);
    if (Number.isNaN(t)) {
      return NextResponse.json({ error: "Invalid postAt date" }, { status: 400 });
    }

    ensureTweetSchedulerWorker();
    scheduleTweet(text, postAt);
    await processDueTweets();

    return NextResponse.json({ message: "Tweet scheduled successfully!" });
  } catch (err) {
    console.error("[tweet-scheduler]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
