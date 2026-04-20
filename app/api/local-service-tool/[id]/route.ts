import { NextRequest, NextResponse } from "next/server"
import { runLocalServiceTool } from "@/lib/localServiceTools/engine"
import { getLocalServiceTool } from "@/lib/localServiceTools/metadata"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!getLocalServiceTool(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const body = (await req.json().catch(() => ({}))) as unknown
  const values =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, string>)
      : {}
  const result = runLocalServiceTool(id, values)
  return NextResponse.json(result)
}
