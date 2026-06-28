import { NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { jsonError, jsonOk } from '../http'
import { buildPublicContent, createSubmission, getPublishedNewsById } from '../services/content'
import { joinSchema } from '../schemas/submission'

export async function handlePublicContent() {
  try {
    return jsonOk(await buildPublicContent())
  } catch (err) {
    console.error('[api/public/content]', err)
    return jsonError('Content unavailable', 503, { message: String(err) })
  }
}

export async function handlePublicNews(id: string) {
  try {
    const post = await getPublishedNewsById(id)
    if (!post) return jsonError('News post not found', 404)
    return jsonOk(post)
  } catch (err) {
    console.error('[api/public/news]', err)
    return jsonError('News unavailable', 503, { message: String(err) })
  }
}

export async function handleJoin(request: NextRequest) {
  const parsed = joinSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return jsonError('Invalid form data', 400, parsed.error.flatten())

  try {
    const submission = await createSubmission({
      id: randomUUID(),
      ...parsed.data,
      source: 'website',
    })
    return jsonOk({ ok: true, id: submission?.id }, 201)
  } catch (err) {
    console.error('[api/public/join]', err)
    return jsonError('Submission failed', 503, { message: String(err) })
  }
}
