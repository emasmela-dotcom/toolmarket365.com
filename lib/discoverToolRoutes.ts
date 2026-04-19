import { existsSync, readdirSync, statSync } from "fs"
import { join } from "path"

/**
 * All public routes under /tools that have a page.tsx (includes nested e.g. instagram-scheduler/accounts).
 */
export function discoverToolRoutes(): string[] {
  const root = join(process.cwd(), "app", "tools")
  const paths = new Set<string>()

  function walkDir(absDir: string, urlSuffix: string) {
    if (existsSync(join(absDir, "page.tsx"))) {
      paths.add(`/tools${urlSuffix}`)
    }
    let entries
    try {
      entries = readdirSync(absDir, { withFileTypes: true })
    } catch {
      return
    }
    for (const ent of entries) {
      if (
        !ent.isDirectory() ||
        ent.name.startsWith("_") ||
        ent.name.startsWith("(") ||
        ent.name.startsWith("[")
      )
        continue
      const childAbs = join(absDir, ent.name)
      try {
        if (!statSync(childAbs).isDirectory()) continue
      } catch {
        continue
      }
      walkDir(childAbs, `${urlSuffix}/${ent.name}`)
    }
  }

  if (existsSync(join(root, "page.tsx"))) {
    paths.add("/tools")
  }

  let top
  try {
    top = readdirSync(root, { withFileTypes: true })
  } catch {
    return [...paths].sort()
  }
  for (const ent of top) {
    if (!ent.isDirectory()) continue
    walkDir(join(root, ent.name), `/${ent.name}`)
  }
  return [...paths].sort()
}
