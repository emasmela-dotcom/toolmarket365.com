import { LIFE_TOOLS } from "./metadata"

const ORDER: { category: string; tag: string }[] = [
  { category: "Personal Finance", tag: "(MONEY)" },
  { category: "Writing & Communication", tag: "(WORDS)" },
  { category: "Health & Wellness", tag: "(BODY)" },
  { category: "Learning & Productivity", tag: "(STUDY)" },
  { category: "Home & Life", tag: "(HOME)" },
  { category: "Family & Parenting", tag: "(FAMILY)" },
  { category: "Travel", tag: "(TRIP)" },
  { category: "Fun & Lifestyle", tag: "(FUN)" },
  { category: "Privacy & Safety", tag: "(SAFE)" },
  { category: "Everyday Calculators", tag: "(MATH)" },
]

export function lifeToolSectionsForHome(): {
  category: string
  tag: string
  tools: { id: string; title: string }[]
}[] {
  return ORDER.map(({ category, tag }) => ({
    category,
    tag,
    tools: LIFE_TOOLS.filter((t) => t.category === category).map((t) => ({
      id: t.id,
      title: t.title,
    })),
  }))
}
