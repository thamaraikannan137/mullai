import { jsonOk } from '@/lib/server/http'

export async function GET() {
  return jsonOk({ ok: true })
}
