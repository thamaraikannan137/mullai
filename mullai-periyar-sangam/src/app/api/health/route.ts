import { jsonOk } from '@/lib/server/middleware/auth'

export async function GET() {
  return jsonOk({ ok: true })
}
