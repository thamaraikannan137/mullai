import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { adminSubmissionSchema, submissionUpdateSchema } from '../schemas/submission.js'
import {
  createNews,
  createSubmission,
  deleteNews,
  deleteSubmission,
  getContactContent,
  getContentSection,
  getDashboardStats,
  getDemandsContent,
  getHeroSlides,
  getLeadersContent,
  getNewsById,
  getOrgSettings,
  getSiteImages,
  getSiteMeta,
  getSubmissionById,
  getWaterSettings,
  listAllNews,
  listSubmissions,
  updateContact,
  updateContentSection,
  updateDemands,
  updateHeroSlides,
  updateLeaders,
  updateNews,
  updateOrgSettings,
  updateSiteImages,
  updateSiteMeta,
  updateSubmission,
  updateWaterSettings,
} from '../services/content.js'

export const adminRouter = Router()

adminRouter.use(requireAuth)

adminRouter.get('/dashboard', (_req, res) => {
  res.json(getDashboardStats())
})

const waterSchema = z.object({
  currentLevel: z.number(),
  targetLevel: z.number(),
  capacity: z.number().min(1),
  status: z.enum(['rising', 'stable', 'falling']),
  lastUpdatedTa: z.string(),
  lastUpdatedEn: z.string(),
})

adminRouter.get('/water', (_req, res) => {
  res.json(getWaterSettings())
})

adminRouter.put('/water', (req, res) => {
  const parsed = waterSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid water settings', details: parsed.error.flatten() })
    return
  }
  updateWaterSettings(parsed.data)
  res.json({ ok: true })
})

const siteMetaSchema = z.object({
  seo: z.object({
    titleTa: z.string(),
    titleEn: z.string(),
    descriptionTa: z.string(),
    descriptionEn: z.string(),
  }),
  about: z.object({
    districtCount: z.number(),
    badgeYear: z.number(),
  }),
  social: z.object({
    facebook: z.string(),
    instagram: z.string(),
    youtube: z.string(),
  }),
})

adminRouter.get('/site-meta', (_req, res) => {
  res.json(getSiteMeta())
})

adminRouter.put('/site-meta', (req, res) => {
  const parsed = siteMetaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid site meta', details: parsed.error.flatten() })
    return
  }
  updateSiteMeta(parsed.data)
  res.json({ ok: true })
})

adminRouter.get('/org', (_req, res) => {
  res.json(getOrgSettings())
})

const orgSchema = z.object({
  ta: z.object({
    siteNameLines: z.array(z.string()),
    description: z.string(),
    tagline: z.string(),
    copyright: z.string(),
  }),
  en: z.object({
    siteNameLines: z.array(z.string()),
    description: z.string(),
    tagline: z.string(),
    copyright: z.string(),
  }),
})

adminRouter.put('/org', (req, res) => {
  const parsed = orgSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid org settings', details: parsed.error.flatten() })
    return
  }
  updateOrgSettings(parsed.data.ta, parsed.data.en)
  res.json({ ok: true })
})

adminRouter.get('/images', (_req, res) => {
  res.json(getSiteImages())
})

const imagesSchema = z.object({
  about: z.string(),
  join: z.string(),
  presidentPhoto: z.string(),
})

adminRouter.put('/images', (req, res) => {
  const parsed = imagesSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid images', details: parsed.error.flatten() })
    return
  }
  updateSiteImages(parsed.data)
  res.json({ ok: true })
})

adminRouter.get('/hero-slides', (_req, res) => {
  res.json(getHeroSlides())
})

const heroSlideSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string(),
  poster: z.string().optional(),
  alt: z.string(),
})

adminRouter.put('/hero-slides', (req, res) => {
  const parsed = z.array(heroSlideSchema).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid hero slides', details: parsed.error.flatten() })
    return
  }
  updateHeroSlides(parsed.data)
  res.json({ ok: true })
})

const contentSections = ['hero', 'about', 'quote', 'footer', 'join'] as const

adminRouter.get('/content/:section', (req, res) => {
  const section = req.params.section
  if (!contentSections.includes(section as (typeof contentSections)[number])) {
    res.status(400).json({ error: 'Invalid content section' })
    return
  }
  res.json(getContentSection(section))
})

adminRouter.put('/content/:section', (req, res) => {
  const section = req.params.section
  if (!contentSections.includes(section as (typeof contentSections)[number])) {
    res.status(400).json({ error: 'Invalid content section' })
    return
  }
  const body = req.body as { ta?: unknown; en?: unknown }
  if (body.ta === undefined || body.en === undefined) {
    res.status(400).json({ error: 'ta and en required' })
    return
  }
  updateContentSection(section, body.ta, body.en)
  res.json({ ok: true })
})

adminRouter.get('/contact', (_req, res) => {
  res.json(getContactContent())
})

const contactSchema = z.object({
  ta: z.object({
    sectionLabel: z.string(),
    title: z.string(),
    description: z.string(),
    hours: z.string(),
    items: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        icon: z.enum(['phone', 'email', 'location']),
      }),
    ),
  }),
  en: z.object({
    sectionLabel: z.string(),
    title: z.string(),
    description: z.string(),
    hours: z.string(),
    items: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        icon: z.enum(['phone', 'email', 'location']),
      }),
    ),
  }),
})

adminRouter.put('/contact', (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid contact data', details: parsed.error.flatten() })
    return
  }
  updateContact(parsed.data.ta, parsed.data.en)
  res.json({ ok: true })
})

adminRouter.get('/leaders', (_req, res) => {
  res.json(getLeadersContent())
})

adminRouter.put('/leaders', (req, res) => {
  const body = req.body as { ta?: Record<string, unknown>; en?: Record<string, unknown> }
  if (!body.ta || !body.en) {
    res.status(400).json({ error: 'ta and en leaders data required' })
    return
  }
  updateLeaders(body.ta, body.en)
  res.json({ ok: true })
})

adminRouter.get('/demands', (_req, res) => {
  res.json(getDemandsContent())
})

adminRouter.put('/demands', (req, res) => {
  const body = req.body as { ta?: Record<string, unknown>; en?: Record<string, unknown> }
  if (!body.ta || !body.en) {
    res.status(400).json({ error: 'ta and en demands data required' })
    return
  }
  updateDemands(body.ta, body.en)
  res.json({ ok: true })
})

adminRouter.get('/news', (_req, res) => {
  res.json(listAllNews())
})

adminRouter.get('/news/:id', (req, res) => {
  const post = getNewsById(req.params.id)
  if (!post) {
    res.status(404).json({ error: 'News post not found' })
    return
  }
  res.json(post)
})

const newsSchema = z.object({
  tag_ta: z.string().min(1),
  tag_en: z.string().min(1),
  published_at: z.string().min(1),
  title_ta: z.string().min(1),
  title_en: z.string().min(1),
  body_ta: z.string().min(1),
  body_en: z.string().min(1),
  image_url: z.string().default(''),
  media_type: z.enum(['image', 'youtube']).default('image'),
  is_published: z.union([z.boolean(), z.number()]).transform((v) => (v ? 1 : 0)),
  sort_order: z.number().int().default(0),
})

adminRouter.post('/news', (req, res) => {
  const parsed = newsSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid news data', details: parsed.error.flatten() })
    return
  }

  const id = randomUUID()
  const post = createNews({ id, ...parsed.data })
  res.status(201).json(post)
})

adminRouter.put('/news/:id', (req, res) => {
  const parsed = newsSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid news data', details: parsed.error.flatten() })
    return
  }

  const data = { ...parsed.data }
  if (data.is_published !== undefined) {
    data.is_published = data.is_published ? 1 : 0
  }

  const post = updateNews(req.params.id, data)
  if (!post) {
    res.status(404).json({ error: 'News post not found' })
    return
  }
  res.json(post)
})

adminRouter.delete('/news/:id', (req, res) => {
  const ok = deleteNews(req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'News post not found' })
    return
  }
  res.json({ ok: true })
})

adminRouter.get('/submissions', (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined
  res.json(listSubmissions(status))
})

adminRouter.post('/submissions', (req, res) => {
  const parsed = adminSubmissionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid member data', details: parsed.error.flatten() })
    return
  }

  const submission = createSubmission({
    id: randomUUID(),
    ...parsed.data,
    source: 'manual',
  })

  res.status(201).json(submission)
})

adminRouter.get('/submissions/:id', (req, res) => {
  const row = getSubmissionById(req.params.id)
  if (!row) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }
  res.json(row)
})

adminRouter.patch('/submissions/:id', (req, res) => {
  const parsed = submissionUpdateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() })
    return
  }

  const row = updateSubmission(req.params.id, parsed.data)
  if (!row) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }
  res.json(row)
})

adminRouter.delete('/submissions/:id', (req, res) => {
  const ok = deleteSubmission(req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }
  res.json({ ok: true })
})
