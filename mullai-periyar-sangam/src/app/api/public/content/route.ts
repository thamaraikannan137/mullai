import { handlePublicContent } from '@/lib/server/handlers/public'

export async function GET() {
  return handlePublicContent()
}
