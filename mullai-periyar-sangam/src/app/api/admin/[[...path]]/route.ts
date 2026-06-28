import { NextRequest } from 'next/server'
import { requireAuthUser } from '@/lib/server/middleware/auth'
import { handleAdminRequest } from '@/lib/server/handlers/admin'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ path?: string[] }> }

async function dispatch(request: NextRequest, ctx: Ctx) {
  const user = await requireAuthUser(request)
  if (user instanceof Response) return user
  const { path = [] } = await ctx.params
  return handleAdminRequest(request, path)
}

export const GET = dispatch
export const POST = dispatch
export const PUT = dispatch
export const PATCH = dispatch
export const DELETE = dispatch
