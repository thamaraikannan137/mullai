import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { getUserByEmail, requireAuth, sanitizeUser, signToken } from '../middleware/auth.js'

export const authRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email or password' })
    return
  }

  const user = await getUserByEmail(parsed.data.email)
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const valid = bcrypt.compareSync(parsed.data.password, user.password_hash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const token = signToken(user)
  res.json({ token, user: sanitizeUser(user) })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user!) })
})
