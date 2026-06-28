import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from './db.js'
import { seedDatabase } from './seed-database.js'
import { authRouter } from './routes/auth.js'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT || 3000)

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/public', publicRouter)
app.use('/api/admin/auth', authRouter)
app.use('/api/admin', adminRouter)

const staticDir = process.env.STATIC_DIR
  ? path.resolve(process.env.STATIC_DIR)
  : path.join(__dirname, '..', 'static')

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir, { index: false }))
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })
}

async function main() {
  await migrate()
  const seeded = await seedDatabase()
  if (seeded) {
    console.log('Database seeded on startup.')
  }

  app.listen(port, () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-me') {
      console.warn('WARNING: Set a strong JWT_SECRET in production')
    }
    console.log(`Mullai API running on port ${port}`)
  })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
