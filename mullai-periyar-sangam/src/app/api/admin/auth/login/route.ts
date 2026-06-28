import { NextRequest } from 'next/server'
import { handleLogin } from '@/lib/server/handlers/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  return handleLogin(request)
}
