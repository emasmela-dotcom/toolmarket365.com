import { NextResponse } from "next/server";
import { getScheduledTweets } from "@/lib/autoTweetScheduler";

export async function GET() {
  return NextResponse.json({ tweets: getScheduledTweets() });
}
