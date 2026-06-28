import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import type { JwtPayload, User } from '../types'
import { queryOne } from '../db'
import { jsonError, jsonOk } from '../http'

export { jsonOk, jsonError }

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function signToken(user: User) {
  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
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

export async function getAuthUser(request: NextRequest): Promise<User | null> {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null

  try {
    const payload = verifyToken(token)
    const user = await queryOne<User>(
      `SELECT * FROM users WHERE id = $1 AND is_active = 1`,
      [payload.userId],
    )
    return user ?? null
  } catch {
    return null
  }
}
export async function requireAuthUser(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return jsonError('Authentication required', 401)
  return user
}
