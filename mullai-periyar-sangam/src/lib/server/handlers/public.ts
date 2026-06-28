import { NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getUserByEmail, getAuthUser, jsonError, jsonOk, sanitizeUser, signToken } from '../middleware/auth'
import { buildPublicContent, createSubmission, getPublishedNewsById } from '../services/content'
import { joinSchema } from '../schemas/submission'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkLoginRateLimit(ip: string) {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count += 1
  return true
}

export async function handleLogin(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'local'
  if (!checkLoginRateLimit(ip)) {
    return jsonError('Too many login attempts. Try again later.', 429)
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return jsonError('Invalid email or password', 400)

  const user = await getUserByEmail(parsed.data.email)
  if (!user || !bcrypt.compareSync(parsed.data.password, user.password_hash)) {
    return jsonError('Invalid email or password', 401)
  }

  return jsonOk({ token: signToken(user), user: sanitizeUser(user) })
}

export async function handleMe(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return jsonError('Authentication required', 401)
  return jsonOk({ user: sanitizeUser(user) })
}

export async function handlePublicContent() {
  try {
    return jsonOk(await buildPublicContent())
  } catch (err) {
    return jsonError('Content unavailable', 503, { message: String(err) })
  }
}

export async function handlePublicNews(id: string) {
  const post = await getPublishedNewsById(id)
  if (!post) return jsonError('News post not found', 404)
  return jsonOk(post)
}

export async function handleJoin(request: NextRequest) {
  const parsed = joinSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return jsonError('Invalid form data', 400, parsed.error.flatten())

  const submission = await createSubmission({
    id: randomUUID(),
    ...parsed.data,
    source: 'website',
  })
  return jsonOk({ ok: true, id: submission?.id }, 201)
}
