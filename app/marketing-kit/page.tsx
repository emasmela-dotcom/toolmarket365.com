import type { Metadata } from "next"
import { SITE_NAME } from "@/lib/siteConfig"
import MarketingKitClient from "./MarketingKitClient"

export const metadata: Metadata = {
  title: "Marketing kit",
  description: `UTM presets, copy bank, and tracking checklist for ${SITE_NAME}.`,
  robots: { index: false, follow: true },
}

export default function MarketingKitPage() {
  return <MarketingKitClient />
}
