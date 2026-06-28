import { NextRequest } from 'next/server'
import { handleJoin } from '@/lib/server/handlers/public'

export async function POST(request: NextRequest) {
  return handleJoin(request)
}
