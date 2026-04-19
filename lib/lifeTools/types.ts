export type LifeFieldType = "text" | "number" | "textarea"

export type LifeField = {
  key: string
  label: string
  type: LifeFieldType
  placeholder?: string
  optional?: boolean
}

export type LifeToolMeta = {
  id: string
  category: string
  title: string
  description: string
  fields: LifeField[]
}

export type LifeToolRunResult = { ok: true; output: string } | { ok: false; error: string }
