import 'dotenv/config'
import { seedDatabase } from './seed-database.js'

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
