import { NextRequest } from 'next/server'
import { handleMe } from '@/lib/server/handlers/public'

export async function GET(request: NextRequest) {
  return handleMe(request)
}
