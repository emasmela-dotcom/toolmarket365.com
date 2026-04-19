import { notFound } from "next/navigation"
import { allLifeToolIds, getLifeTool } from "@/lib/lifeTools/metadata"
import { LifeToolClient } from "./LifeToolClient"

export function generateStaticParams() {
  return allLifeToolIds().map((id) => ({ id }))
}

export default async function LifeToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const meta = getLifeTool(id)
  if (!meta) notFound()
  return <LifeToolClient meta={meta} />
}
