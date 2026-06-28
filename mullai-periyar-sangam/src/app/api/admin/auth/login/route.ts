import { NextRequest } from 'next/server'
import { handleLogin } from '@/lib/server/handlers/public'

export async function POST(request: NextRequest) {
  return handleLogin(request)
}
