import { Router } from 'express'
import { buildPublicContent, createSubmission, getPublishedNewsById } from '../services/content.js'
import { joinSchema } from '../schemas/submission.js'
import { randomUUID } from 'node:crypto'

export const publicRouter = Router()

publicRouter.get('/content', async (_req, res) => {
  try {
    res.json(await buildPublicContent())
  } catch (err) {
    res.status(503).json({ error: 'Content unavailable', message: String(err) })
  }
})

publicRouter.get('/news/:id', async (req, res) => {
  const post = await getPublishedNewsById(req.params.id)
  if (!post) {
    res.status(404).json({ error: 'News post not found' })
    return
  }
  res.json(post)
})

publicRouter.post('/join', async (req, res) => {
  const parsed = joinSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid form data', details: parsed.error.flatten() })
    return
  }

  const submission = await createSubmission({
    id: randomUUID(),
    ...parsed.data,
    source: 'website',
  })

  res.status(201).json({ ok: true, id: submission?.id })
})
