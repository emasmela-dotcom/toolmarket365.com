import { NextResponse } from "next/server";
import { getFollowUps } from "@/lib/followUpStore";

export async function GET() {
  return NextResponse.json({ followUps: getFollowUps() });
}
