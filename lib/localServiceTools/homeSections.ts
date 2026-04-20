import { LOCAL_SERVICE_TOOLS } from "./metadata"

const ORDER: { category: string; tag: string }[] = [
  { category: "Reviews & Reputation", tag: "(REVIEWS)" },
  { category: "Google Business Profile", tag: "(GBP)" },
  { category: "SMS & Messaging", tag: "(SMS)" },
  { category: "Local Offers & Promotions", tag: "(OFFERS)" },
  { category: "Booking & Scheduling", tag: "(BOOKING)" },
  { category: "CRM & Lead Management", tag: "(CRM)" },
  { category: "Local SEO & Reporting", tag: "(REPORTS)" },
]

export function localServiceSectionsForHome(): {
  category: string
  tag: string
  tools: { id: string; title: string }[]
}[] {
  return ORDER.map(({ category, tag }) => ({
    category,
    tag,
    tools: LOCAL_SERVICE_TOOLS.filter((t) => t.category === category).map((t) => ({
      id: t.id,
      title: t.title,
    })),
  }))
}
