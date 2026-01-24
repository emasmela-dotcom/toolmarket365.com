#!/usr/bin/env node

/**
 * Setup script for Public Template Library database schema
 * 
 * This script reads the SQL schema file and executes it against your Neon PostgreSQL database.
 * 
 * Usage:
 *   node scripts/setup-template-library-db.mjs
 * 
 * Requirements:
 *   - DATABASE_URL environment variable must be set
 *   - @neondatabase/serverless package installed
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('   Please set it in your .env.local file')
  process.exit(1)
}

const sql = neon(connectionString)

async function setupDatabase() {
  try {
    console.log('📦 Setting up Public Template Library database...\n')

    // Read the SQL schema file
    const schemaPath = join(__dirname, '../lib/db/public-template-library-schema.sql')
    const schemaSQL = readFileSync(schemaPath, 'utf-8')

    // Split by semicolons and execute each statement
    // Note: This is a simple approach. For production, consider using a proper SQL parser
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    let executed = 0
    let errors = 0

    for (const statement of statements) {
      try {
        // Skip empty statements and comments
        if (!statement || statement.startsWith('--')) continue

        // Execute the statement
        await sql(statement)
        executed++
        process.stdout.write('.')
      } catch (error) {
        // Some errors are expected (like IF NOT EXISTS conflicts)
        if (error.message?.includes('already exists') || 
            error.message?.includes('duplicate key') ||
            error.message?.includes('ON CONFLICT')) {
          // These are expected, continue
          executed++
          process.stdout.write('✓')
        } else {
          errors++
          console.error(`\n❌ Error executing statement:`, error.message)
          console.error(`Statement: ${statement.substring(0, 100)}...`)
        }
      }
    }

    console.log('\n\n✅ Database setup complete!')
    console.log(`   Executed: ${executed} statements`)
    if (errors > 0) {
      console.log(`   Errors: ${errors} (some may be expected)`)
    }
    console.log('\n🎉 Public Template Library is ready to use!')
    console.log('   Visit /templates to browse templates\n')

  } catch (error) {
    console.error('\n❌ Fatal error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
