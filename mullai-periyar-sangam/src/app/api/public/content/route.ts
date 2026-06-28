import { handlePublicContent } from '@/lib/server/handlers/content'

export const runtime = 'nodejs'

export async function GET() {
  return handlePublicContent()
}
