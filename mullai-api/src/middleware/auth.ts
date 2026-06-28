import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload, User } from '../types.js'
import { queryOne } from '../db.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function signToken(user: User) {
  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    const payload = verifyToken(token)
    const user = await queryOne<User>(
      `SELECT * FROM users WHERE id = $1 AND is_active = 1`,
      [payload.userId],
    )

    if (!user) {
      res.status(401).json({ error: 'Invalid session' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function getUserByEmail(email: string) {
  return queryOne<User & { password_hash: string }>(
    `SELECT * FROM users WHERE email = $1 AND is_active = 1`,
    [email],
  )
}

export async function getUserById(id: string) {
  return queryOne<User>(`SELECT * FROM users WHERE id = $1`, [id])
}

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
  }
}
