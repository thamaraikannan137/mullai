export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { migrate } = await import('./src/lib/server/db')
    const { seedDatabase } = await import('./src/lib/server/seed-database')
    await migrate()
    await seedDatabase()
  }
}
