import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { publicRouter } from './routes/public.js'
import { adminRouter } from './routes/admin.js'

const app = express()
const port = Number(process.env.PORT || 3001)

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((s) => s.trim())

app.use(
  cors({
    origin: corsOrigins,
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

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(port, () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-me') {
    console.warn('WARNING: Set a strong JWT_SECRET in production')
  }
  console.log(`Mullai API running at http://localhost:${port}`)
})
