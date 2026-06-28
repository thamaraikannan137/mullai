import { NextRequest } from 'next/server'
import { handleJoin } from '@/lib/server/handlers/content'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  return handleJoin(request)
}
