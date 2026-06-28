import type {
  ContactSection,
  HeroSlide,
  JoinSubmissionRow,
  NewsPostRow,
  PublicContentResponse,
  SiteImages,
  SiteMeta,
  WaterSettings,
} from '../types.js'
import { execute, query, queryOne } from '../db.js'

type SiteRow = {
  content_ta: string
  content_en: string
  hero_slides: string
  images: string
  water_settings: string | null
  site_meta: string | null
}

async function getSiteRow(): Promise<SiteRow> {
  const row = await queryOne<SiteRow>(`SELECT * FROM site_content WHERE id = 1`)
  if (!row) throw new Error('Site content not seeded. Run: npm run seed')
  return row
}

const DEFAULT_WATER: WaterSettings = {
  currentLevel: 142,
  targetLevel: 152,
  capacity: 152,
  status: 'rising',
  lastUpdatedTa: 'ஜூன் 25, 2026',
  lastUpdatedEn: '25 June 2026',
}

const DEFAULT_META: SiteMeta = {
  seo: {
    titleTa:
      'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் | Mullai Periyar Single-Crop Irrigation Farmers\' Association',
    titleEn:
      'Mullai Periyar Single-Crop Irrigation Farmers\' Association | Mullai Periyar Sangam',
    descriptionTa:
      'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் — பெரியாறு நீரை நம்பி வாழும் தென் தமிழ்நாட்டு விவசாயிகளின் உரிமைகளைப் பாதுகாக்கும் கூட்டமைப்பு.',
    descriptionEn:
      'Mullai Periyar Single-Crop Irrigation Farmers\' Association — advocating for fair water rights for farmers across five southern Tamil Nadu districts.',
  },
  about: { districtCount: 5, badgeYear: 1895 },
  social: { facebook: '', instagram: '', youtube: '' },
}

export async function getWaterSettings(): Promise<WaterSettings> {
  const row = await getSiteRow()
  if (!row.water_settings) return DEFAULT_WATER
  return { ...DEFAULT_WATER, ...JSON.parse(row.water_settings) }
}

export async function updateWaterSettings(settings: WaterSettings) {
  await execute(
    `UPDATE site_content SET water_settings = $1, updated_at = NOW() WHERE id = 1`,
    [JSON.stringify(settings)],
  )
}

export async function getSiteMeta(): Promise<SiteMeta> {
  const row = await getSiteRow()
  if (!row.site_meta) return DEFAULT_META
  const parsed = JSON.parse(row.site_meta) as SiteMeta
  return {
    seo: { ...DEFAULT_META.seo, ...parsed.seo },
    about: { ...DEFAULT_META.about, ...parsed.about },
    social: { ...DEFAULT_META.social, ...parsed.social },
  }
}

export async function updateSiteMeta(meta: SiteMeta) {
  await execute(`UPDATE site_content SET site_meta = $1, updated_at = NOW() WHERE id = 1`, [
    JSON.stringify(meta),
  ])
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const row = await getSiteRow()
  return JSON.parse(row.hero_slides) as HeroSlide[]
}

export async function updateHeroSlides(slides: HeroSlide[]) {
  await execute(`UPDATE site_content SET hero_slides = $1, updated_at = NOW() WHERE id = 1`, [
    JSON.stringify(slides),
  ])
}

export async function getSiteImages(): Promise<SiteImages> {
  const row = await getSiteRow()
  return JSON.parse(row.images) as SiteImages
}

export async function updateSiteImages(images: SiteImages) {
  await execute(`UPDATE site_content SET images = $1, updated_at = NOW() WHERE id = 1`, [
    JSON.stringify(images),
  ])
}

export async function getContentSection(key: string) {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as Record<string, unknown>
  const en = JSON.parse(row.content_en) as Record<string, unknown>
  return { ta: ta[key], en: en[key] }
}

export async function updateContentSection(key: string, ta: unknown, en: unknown) {
  await updateSection(key, ta, en)
}

export async function getOrgSettings() {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as {
    siteNameLines: string[]
    footer: { description: string; tagline: string; copyright: string }
  }
  const en = JSON.parse(row.content_en) as {
    siteNameLines: string[]
    footer: { description: string; tagline: string; copyright: string }
  }
  return {
    ta: {
      siteNameLines: ta.siteNameLines,
      description: ta.footer.description,
      tagline: ta.footer.tagline,
      copyright: ta.footer.copyright,
    },
    en: {
      siteNameLines: en.siteNameLines,
      description: en.footer.description,
      tagline: en.footer.tagline,
      copyright: en.footer.copyright,
    },
  }
}

export async function updateOrgSettings(
  ta: { siteNameLines: string[]; description: string; tagline: string; copyright: string },
  en: { siteNameLines: string[]; description: string; tagline: string; copyright: string },
) {
  const row = await getSiteRow()
  const contentTa = JSON.parse(row.content_ta) as Record<string, unknown>
  const contentEn = JSON.parse(row.content_en) as Record<string, unknown>
  contentTa.siteNameLines = ta.siteNameLines
  contentEn.siteNameLines = en.siteNameLines
  ;(contentTa.footer as Record<string, unknown>).description = ta.description
  ;(contentTa.footer as Record<string, unknown>).tagline = ta.tagline
  ;(contentTa.footer as Record<string, unknown>).copyright = ta.copyright
  ;(contentEn.footer as Record<string, unknown>).description = en.description
  ;(contentEn.footer as Record<string, unknown>).tagline = en.tagline
  ;(contentEn.footer as Record<string, unknown>).copyright = en.copyright
  await execute(
    `UPDATE site_content SET content_ta = $1, content_en = $2, updated_at = NOW() WHERE id = 1`,
    [JSON.stringify(contentTa), JSON.stringify(contentEn)],
  )
}

async function getPublishedNews() {
  return query<NewsPostRow>(
    `SELECT * FROM news_posts WHERE is_published = 1 ORDER BY sort_order ASC, published_at DESC`,
  )
}

function newsToItems(posts: NewsPostRow[], lang: 'ta' | 'en') {
  return posts.map((p) => ({
    id: p.id,
    tag: lang === 'ta' ? p.tag_ta : p.tag_en,
    date: p.published_at,
    title: lang === 'ta' ? p.title_ta : p.title_en,
    body: lang === 'ta' ? p.body_ta : p.body_en,
    img: p.image_url,
    mediaType: p.media_type === 'youtube' ? 'youtube' : 'image',
  }))
}

export async function buildPublicContent(): Promise<PublicContentResponse> {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as Record<string, unknown>
  const en = JSON.parse(row.content_en) as Record<string, unknown>
  const heroSlides = JSON.parse(row.hero_slides) as HeroSlide[]
  const images = JSON.parse(row.images) as SiteImages
  const news = await getPublishedNews()
  const water = await getWaterSettings()
  const siteMeta = await getSiteMeta()

  const taMerged = { ...ta, news: { ...(ta.news as object), items: newsToItems(news, 'ta') } } as Record<
    string,
    unknown
  >
  const enMerged = { ...en, news: { ...(en.news as object), items: newsToItems(news, 'en') } } as Record<
    string,
    unknown
  >

  if (taMerged.hero && typeof taMerged.hero === 'object') {
    const heroTa = taMerged.hero as Record<string, unknown>
    heroTa.waterLevel = `${water.targetLevel} அடி`
    const stats = heroTa.stats as Array<{ value: string; label: string }> | undefined
    if (stats?.[1]) stats[1].value = `${water.targetLevel} அடி`
  }
  if (enMerged.hero && typeof enMerged.hero === 'object') {
    const heroEn = enMerged.hero as Record<string, unknown>
    heroEn.waterLevel = `${water.targetLevel} ft`
    const stats = heroEn.stats as Array<{ value: string; label: string }> | undefined
    if (stats?.[1]) stats[1].value = `${water.targetLevel} ft`
  }

  return {
    ta: taMerged,
    en: enMerged,
    heroSlides,
    images,
    water,
    siteMeta,
  }
}

export async function getContactContent(): Promise<{ ta: ContactSection; en: ContactSection }> {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as { contact: ContactSection }
  const en = JSON.parse(row.content_en) as { contact: ContactSection }
  return { ta: ta.contact, en: en.contact }
}

export async function updateContact(ta: ContactSection, en: ContactSection) {
  const row = await getSiteRow()
  const contentTa = JSON.parse(row.content_ta) as Record<string, unknown>
  const contentEn = JSON.parse(row.content_en) as Record<string, unknown>
  contentTa.contact = ta
  contentEn.contact = en

  await execute(
    `UPDATE site_content SET content_ta = $1, content_en = $2, updated_at = NOW() WHERE id = 1`,
    [JSON.stringify(contentTa), JSON.stringify(contentEn)],
  )
}

async function updateSection(key: string, ta: unknown, en: unknown) {
  const row = await getSiteRow()
  const contentTa = JSON.parse(row.content_ta) as Record<string, unknown>
  const contentEn = JSON.parse(row.content_en) as Record<string, unknown>
  contentTa[key] = ta
  contentEn[key] = en
  await execute(
    `UPDATE site_content SET content_ta = $1, content_en = $2, updated_at = NOW() WHERE id = 1`,
    [JSON.stringify(contentTa), JSON.stringify(contentEn)],
  )
}

export async function getLeadersContent() {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as { leaders: Record<string, unknown> }
  const en = JSON.parse(row.content_en) as { leaders: Record<string, unknown> }
  return { ta: ta.leaders, en: en.leaders }
}

export async function updateLeaders(ta: Record<string, unknown>, en: Record<string, unknown>) {
  await updateSection('leaders', ta, en)
}

export async function getDemandsContent() {
  const row = await getSiteRow()
  const ta = JSON.parse(row.content_ta) as { demands: Record<string, unknown> }
  const en = JSON.parse(row.content_en) as { demands: Record<string, unknown> }
  return { ta: ta.demands, en: en.demands }
}

export async function updateDemands(ta: Record<string, unknown>, en: Record<string, unknown>) {
  await updateSection('demands', ta, en)
}

export async function getPublishedNewsById(id: string) {
  return queryOne<NewsPostRow>(`SELECT * FROM news_posts WHERE id = $1 AND is_published = 1`, [id])
}

export async function listAllNews() {
  return query<NewsPostRow>(
    `SELECT * FROM news_posts ORDER BY sort_order ASC, published_at DESC`,
  )
}

export async function getNewsById(id: string) {
  return queryOne<NewsPostRow>(`SELECT * FROM news_posts WHERE id = $1`, [id])
}

export async function createNews(data: Omit<NewsPostRow, 'created_at' | 'updated_at'>) {
  await execute(
    `INSERT INTO news_posts (id, tag_ta, tag_en, published_at, title_ta, title_en, body_ta, body_en, image_url, media_type, is_published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      data.id,
      data.tag_ta,
      data.tag_en,
      data.published_at,
      data.title_ta,
      data.title_en,
      data.body_ta,
      data.body_en,
      data.image_url,
      data.media_type ?? 'image',
      data.is_published,
      data.sort_order,
    ],
  )
  return getNewsById(data.id)
}

export async function updateNews(id: string, data: Partial<NewsPostRow>) {
  const existing = await getNewsById(id)
  if (!existing) return undefined

  const merged = { ...existing, ...data, id, media_type: data.media_type ?? existing.media_type ?? 'image' }
  await execute(
    `UPDATE news_posts SET
      tag_ta = $2, tag_en = $3, published_at = $4,
      title_ta = $5, title_en = $6, body_ta = $7, body_en = $8,
      image_url = $9, media_type = $10, is_published = $11, sort_order = $12,
      updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      merged.tag_ta,
      merged.tag_en,
      merged.published_at,
      merged.title_ta,
      merged.title_en,
      merged.body_ta,
      merged.body_en,
      merged.image_url,
      merged.media_type,
      merged.is_published,
      merged.sort_order,
    ],
  )
  return getNewsById(id)
}

export async function deleteNews(id: string) {
  const count = await execute(`DELETE FROM news_posts WHERE id = $1`, [id])
  return count > 0
}

export async function listSubmissions(status?: string) {
  if (status) {
    return query<JoinSubmissionRow>(
      `SELECT * FROM join_submissions WHERE status = $1 ORDER BY created_at DESC`,
      [status],
    )
  }
  return query<JoinSubmissionRow>(`SELECT * FROM join_submissions ORDER BY created_at DESC`)
}

export async function getSubmissionById(id: string) {
  return queryOne<JoinSubmissionRow>(`SELECT * FROM join_submissions WHERE id = $1`, [id])
}

export async function createSubmission(data: {
  id: string
  name: string
  father_name: string
  village: string
  phone: string
  aadhaar: string
  email: string
  status?: JoinSubmissionRow['status']
  source?: JoinSubmissionRow['source']
}) {
  await execute(
    `INSERT INTO join_submissions (id, name, father_name, village, phone, aadhaar, email, status, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      data.id,
      data.name,
      data.father_name,
      data.village,
      data.phone,
      data.aadhaar,
      data.email,
      data.status ?? 'new',
      data.source ?? 'website',
    ],
  )
  return getSubmissionById(data.id)
}

export async function updateSubmission(
  id: string,
  data: {
    name?: string
    father_name?: string
    village?: string
    phone?: string
    aadhaar?: string
    email?: string
    status?: string
    notes?: string | null
  },
) {
  const existing = await getSubmissionById(id)
  if (!existing) return undefined

  await execute(
    `UPDATE join_submissions SET
      name = $2,
      father_name = $3,
      village = $4,
      phone = $5,
      aadhaar = $6,
      email = $7,
      status = $8,
      notes = $9,
      updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      data.name ?? existing.name,
      data.father_name ?? existing.father_name,
      data.village ?? existing.village,
      data.phone ?? existing.phone,
      data.aadhaar ?? existing.aadhaar,
      data.email ?? existing.email,
      data.status ?? existing.status,
      data.notes !== undefined ? data.notes : existing.notes,
    ],
  )
  return getSubmissionById(id)
}

export async function deleteSubmission(id: string) {
  const count = await execute(`DELETE FROM join_submissions WHERE id = $1`, [id])
  return count > 0
}

export async function getDashboardStats() {
  const submissions = await queryOne<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM join_submissions WHERE status = 'new'`,
  )
  const news = await queryOne<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM news_posts WHERE is_published = 1`,
  )
  const total = await queryOne<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM join_submissions`,
  )
  const water = await getWaterSettings()
  return {
    newSubmissions: submissions?.count ?? 0,
    publishedNews: news?.count ?? 0,
    totalSubmissions: total?.count ?? 0,
    waterLevel: water.currentLevel,
    waterTarget: water.targetLevel,
    waterCapacity: water.capacity,
    waterStatus: water.status,
  }
}
