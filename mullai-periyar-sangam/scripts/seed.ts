import fs from 'node:fs'
import path from 'node:path'
import { seedDatabase } from '../src/lib/server/seed-database'

function loadEnvFile(filename: string) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

async function main() {
  const seeded = await seedDatabase({ force: process.env.FORCE_SEED === '1' })
  if (seeded) {
    const email = process.env.ADMIN_INITIAL_EMAIL || 'admin@mullaiperiyar.org'
    const password = process.env.ADMIN_INITIAL_PASSWORD || 'admin123'
    console.log('Database seeded successfully.')
    console.log(`Admin login: ${email} / ${password}`)
  } else {
    console.log('Database already seeded, skipping.')
  }
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
