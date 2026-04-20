import { notFound } from "next/navigation"
import { allLocalServiceToolIds, getLocalServiceTool } from "@/lib/localServiceTools/metadata"
import { LocalServiceToolClient } from "./LocalServiceToolClient"

export function generateStaticParams() {
  return allLocalServiceToolIds().map((id) => ({ id }))
}

export default async function LocalServiceToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const meta = getLocalServiceTool(id)
  if (!meta) notFound()
  return <LocalServiceToolClient meta={meta} />
}
