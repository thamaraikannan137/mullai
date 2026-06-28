import { NextRequest } from 'next/server'
import { handleMe } from '@/lib/server/handlers/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return handleMe(request)
}
