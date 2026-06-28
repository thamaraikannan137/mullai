import { handlePublicNews } from '@/lib/server/handlers/content'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params
  return handlePublicNews(id)
}
