import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { neon } from '@neondatabase/serverless'

function parseDotEnv(contents) {
  const out = {}
  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (key) out[key] = val
  }
  return out
}

function loadEnvFiles() {
  // Make db:init work out-of-the-box with .env.local (like Next.js dev does).
  const candidates = ['.env.local', '.env']
  for (const filename of candidates) {
    const p = path.join(process.cwd(), filename)
    if (!fs.existsSync(p)) continue
    try {
      const env = parseDotEnv(fs.readFileSync(p, 'utf8'))
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] == null || process.env[k] === '') process.env[k] = v
      }
    } catch {
      // ignore
    }
  }
}

function stripSqlComments(sqlText) {
  // Remove -- line comments (good enough for our schema.sql).
  return sqlText
    .split('\n')
    .map((line) => {
      const idx = line.indexOf('--')
      return idx >= 0 ? line.slice(0, idx) : line
    })
    .join('\n')
}

function splitStatements(sqlText) {
  // Naive split by ';' is OK for our schema file (no stored procs).
  return sqlText
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function main() {
  loadEnvFiles()
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Put it in .env.local or export it, then retry.')
    process.exit(1)
  }

  const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
  const raw = fs.readFileSync(schemaPath, 'utf8')
  const cleaned = stripSqlComments(raw)
  const statements = splitStatements(cleaned)

  if (statements.length === 0) {
    console.error('No SQL statements found in lib/schema.sql')
    process.exit(1)
  }

  const sql = neon(connectionString)
  console.log(`Applying ${statements.length} statements from lib/schema.sql...`)

  let successCount = 0
  let skippedCount = 0
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    try {
      // neon supports raw execution by passing a string.
      // eslint-disable-next-line no-await-in-loop
      await sql(stmt)
      successCount++
    } catch (err) {
      // Handle "already exists" errors gracefully (tables, triggers, etc.)
      if (err.code === '42710' || err.code === '42P07' || err.message?.includes('already exists')) {
        skippedCount++
        console.log(`Skipped statement #${i + 1} (already exists)`)
        continue
      }
      console.error(`Failed on statement #${i + 1}:\n${stmt}\n`)
      throw err
    }
  }
  
  console.log(`\n✅ Schema applied: ${successCount} statements executed, ${skippedCount} skipped (already exist)`)

  console.log('Schema applied successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

