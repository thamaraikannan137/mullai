import { randomUUID } from 'node:crypto'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { jsonError, jsonOk } from '../middleware/auth'
import { adminSubmissionSchema, submissionUpdateSchema } from '../schemas/submission'
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
} from '../services/content'

const waterSchema = z.object({
  currentLevel: z.number(),
  targetLevel: z.number(),
  capacity: z.number().min(1),
  status: z.enum(['rising', 'stable', 'falling']),
  lastUpdatedTa: z.string(),
  lastUpdatedEn: z.string(),
})

const siteMetaSchema = z.object({
  seo: z.object({
    titleTa: z.string(),
    titleEn: z.string(),
    descriptionTa: z.string(),
    descriptionEn: z.string(),
  }),
  about: z.object({ districtCount: z.number(), badgeYear: z.number() }),
  social: z.object({ facebook: z.string(), instagram: z.string(), youtube: z.string() }),
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

const imagesSchema = z.object({
  about: z.string(),
  join: z.string(),
  presidentPhoto: z.string(),
})

const heroSlideSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string(),
  poster: z.string().optional(),
  alt: z.string(),
})

const contentSections = ['hero', 'about', 'quote', 'footer', 'join'] as const

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

async function readJson(request: NextRequest) {
  return request.json().catch(() => ({}))
}

export async function handleAdminRequest(request: NextRequest, path: string[]) {
  const route = path.join('/')
  const method = request.method

  if (method === 'GET' && route === 'dashboard') return jsonOk(await getDashboardStats())
  if (method === 'GET' && route === 'water') return jsonOk(await getWaterSettings())
  if (method === 'PUT' && route === 'water') {
    const parsed = waterSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid water settings', 400, parsed.error.flatten())
    await updateWaterSettings(parsed.data)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'site-meta') return jsonOk(await getSiteMeta())
  if (method === 'PUT' && route === 'site-meta') {
    const parsed = siteMetaSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid site meta', 400, parsed.error.flatten())
    await updateSiteMeta(parsed.data)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'org') return jsonOk(await getOrgSettings())
  if (method === 'PUT' && route === 'org') {
    const parsed = orgSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid org settings', 400, parsed.error.flatten())
    await updateOrgSettings(parsed.data.ta, parsed.data.en)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'images') return jsonOk(await getSiteImages())
  if (method === 'PUT' && route === 'images') {
    const parsed = imagesSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid images', 400, parsed.error.flatten())
    await updateSiteImages(parsed.data)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'hero-slides') return jsonOk(await getHeroSlides())
  if (method === 'PUT' && route === 'hero-slides') {
    const parsed = z.array(heroSlideSchema).safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid hero slides', 400, parsed.error.flatten())
    await updateHeroSlides(parsed.data)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'contact') return jsonOk(await getContactContent())
  if (method === 'PUT' && route === 'contact') {
    const parsed = contactSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid contact data', 400, parsed.error.flatten())
    await updateContact(parsed.data.ta, parsed.data.en)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'leaders') return jsonOk(await getLeadersContent())
  if (method === 'PUT' && route === 'leaders') {
    const body = (await readJson(request)) as { ta?: Record<string, unknown>; en?: Record<string, unknown> }
    if (!body.ta || !body.en) return jsonError('ta and en leaders data required', 400)
    await updateLeaders(body.ta, body.en)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'demands') return jsonOk(await getDemandsContent())
  if (method === 'PUT' && route === 'demands') {
    const body = (await readJson(request)) as { ta?: Record<string, unknown>; en?: Record<string, unknown> }
    if (!body.ta || !body.en) return jsonError('ta and en demands data required', 400)
    await updateDemands(body.ta, body.en)
    return jsonOk({ ok: true })
  }
  if (method === 'GET' && route === 'news') return jsonOk(await listAllNews())
  if (method === 'POST' && route === 'news') {
    const parsed = newsSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid news data', 400, parsed.error.flatten())
    const id = randomUUID()
    const post = await createNews({ id, ...parsed.data })
    return jsonOk(post, 201)
  }
  if (method === 'GET' && route === 'submissions') {
    const status = request.nextUrl.searchParams.get('status') ?? undefined
    return jsonOk(await listSubmissions(status))
  }
  if (method === 'POST' && route === 'submissions') {
    const parsed = adminSubmissionSchema.safeParse(await readJson(request))
    if (!parsed.success) return jsonError('Invalid member data', 400, parsed.error.flatten())
    const submission = await createSubmission({ id: randomUUID(), ...parsed.data, source: 'manual' })
    return jsonOk(submission, 201)
  }

  if (path[0] === 'content' && path.length === 2) {
    const section = path[1]
    if (!contentSections.includes(section as (typeof contentSections)[number])) {
      return jsonError('Invalid content section', 400)
    }
    if (method === 'GET') return jsonOk(await getContentSection(section))
    if (method === 'PUT') {
      const body = (await readJson(request)) as { ta?: unknown; en?: unknown }
      if (body.ta === undefined || body.en === undefined) return jsonError('ta and en required', 400)
      await updateContentSection(section, body.ta, body.en)
      return jsonOk({ ok: true })
    }
  }

  if (path[0] === 'news' && path.length === 2) {
    const id = path[1]
    if (method === 'GET') {
      const post = await getNewsById(id)
      if (!post) return jsonError('News post not found', 404)
      return jsonOk(post)
    }
    if (method === 'PUT') {
      const parsed = newsSchema.partial().safeParse(await readJson(request))
      if (!parsed.success) return jsonError('Invalid news data', 400, parsed.error.flatten())
      const data = { ...parsed.data }
      if (data.is_published !== undefined) data.is_published = data.is_published ? 1 : 0
      const post = await updateNews(id, data)
      if (!post) return jsonError('News post not found', 404)
      return jsonOk(post)
    }
    if (method === 'DELETE') {
      const ok = await deleteNews(id)
      if (!ok) return jsonError('News post not found', 404)
      return jsonOk({ ok: true })
    }
  }

  if (path[0] === 'submissions' && path.length === 2) {
    const id = path[1]
    if (method === 'GET') {
      const row = await getSubmissionById(id)
      if (!row) return jsonError('Submission not found', 404)
      return jsonOk(row)
    }
    if (method === 'PATCH') {
      const parsed = submissionUpdateSchema.safeParse(await readJson(request))
      if (!parsed.success) return jsonError('Invalid data', 400, parsed.error.flatten())
      const row = await updateSubmission(id, parsed.data)
      if (!row) return jsonError('Submission not found', 404)
      return jsonOk(row)
    }
    if (method === 'DELETE') {
      const ok = await deleteSubmission(id)
      if (!ok) return jsonError('Submission not found', 404)
      return jsonOk({ ok: true })
    }
  }

  return jsonError('Not found', 404)
}
