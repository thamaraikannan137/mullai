import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { buildPublicContent, createSubmission, getPublishedNewsById } from '../services/content.js'
import { joinSchema } from '../schemas/submission.js'

export const publicRouter = Router()

publicRouter.get('/content', (_req, res) => {
  try {
    res.json(buildPublicContent())
  } catch (err) {
    res.status(503).json({ error: 'Content unavailable', message: String(err) })
  }
})

publicRouter.get('/news/:id', (req, res) => {
  const post = getPublishedNewsById(req.params.id)
  if (!post) {
    res.status(404).json({ error: 'News post not found' })
    return
  }
  res.json(post)
})

publicRouter.post('/join', (req, res) => {
  const parsed = joinSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid form data', details: parsed.error.flatten() })
    return
  }

  const submission = createSubmission({
    id: randomUUID(),
    ...parsed.data,
    source: 'website',
  })

  res.status(201).json({ ok: true, id: submission?.id })
})
