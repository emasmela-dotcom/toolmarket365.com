import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { neon } from '@neondatabase/serverless'

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
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Aborting.')
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

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    try {
      // neon supports raw execution by passing a string.
      // eslint-disable-next-line no-await-in-loop
      await sql(stmt)
    } catch (err) {
      console.error(`Failed on statement #${i + 1}:\n${stmt}\n`)
      throw err
    }
  }

  console.log('Schema applied successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

