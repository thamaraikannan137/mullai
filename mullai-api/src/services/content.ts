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
import { db } from '../db.js'

function getSiteRow() {
  const row = db.prepare('SELECT * FROM site_content WHERE id = 1').get() as
    | {
        content_ta: string
        content_en: string
        hero_slides: string
        images: string
        water_settings: string | null
        site_meta: string | null
      }
    | undefined

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

export function getWaterSettings(): WaterSettings {
  const row = getSiteRow()
  if (!row.water_settings) return DEFAULT_WATER
  return { ...DEFAULT_WATER, ...JSON.parse(row.water_settings) }
}

export function updateWaterSettings(settings: WaterSettings) {
  db.prepare(`UPDATE site_content SET water_settings = ?, updated_at = datetime('now') WHERE id = 1`).run(
    JSON.stringify(settings),
  )
}

export function getSiteMeta(): SiteMeta {
  const row = getSiteRow()
  if (!row.site_meta) return DEFAULT_META
  const parsed = JSON.parse(row.site_meta) as SiteMeta
  return {
    seo: { ...DEFAULT_META.seo, ...parsed.seo },
    about: { ...DEFAULT_META.about, ...parsed.about },
    social: { ...DEFAULT_META.social, ...parsed.social },
  }
}

export function updateSiteMeta(meta: SiteMeta) {
  db.prepare(`UPDATE site_content SET site_meta = ?, updated_at = datetime('now') WHERE id = 1`).run(
    JSON.stringify(meta),
  )
}

export function getHeroSlides(): HeroSlide[] {
  const row = getSiteRow()
  return JSON.parse(row.hero_slides) as HeroSlide[]
}

export function updateHeroSlides(slides: HeroSlide[]) {
  db.prepare(`UPDATE site_content SET hero_slides = ?, updated_at = datetime('now') WHERE id = 1`).run(
    JSON.stringify(slides),
  )
}

export function getSiteImages(): SiteImages {
  const row = getSiteRow()
  return JSON.parse(row.images) as SiteImages
}

export function updateSiteImages(images: SiteImages) {
  db.prepare(`UPDATE site_content SET images = ?, updated_at = datetime('now') WHERE id = 1`).run(
    JSON.stringify(images),
  )
}

export function getContentSection(key: string) {
  const row = getSiteRow()
  const ta = JSON.parse(row.content_ta) as Record<string, unknown>
  const en = JSON.parse(row.content_en) as Record<string, unknown>
  return { ta: ta[key], en: en[key] }
}

export function updateContentSection(key: string, ta: unknown, en: unknown) {
  updateSection(key, ta, en)
}

export function getOrgSettings() {
  const row = getSiteRow()
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

export function updateOrgSettings(
  ta: { siteNameLines: string[]; description: string; tagline: string; copyright: string },
  en: { siteNameLines: string[]; description: string; tagline: string; copyright: string },
) {
  const row = getSiteRow()
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
  db.prepare(
    `UPDATE site_content SET content_ta = ?, content_en = ?, updated_at = datetime('now') WHERE id = 1`,
  ).run(JSON.stringify(contentTa), JSON.stringify(contentEn))
}

function getPublishedNews() {
  return db
    .prepare(
      `SELECT * FROM news_posts WHERE is_published = 1 ORDER BY sort_order ASC, published_at DESC`,
    )
    .all() as NewsPostRow[]
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

export function buildPublicContent(): PublicContentResponse {
  const row = getSiteRow()
  const ta = JSON.parse(row.content_ta) as Record<string, unknown>
  const en = JSON.parse(row.content_en) as Record<string, unknown>
  const heroSlides = JSON.parse(row.hero_slides) as HeroSlide[]
  const images = JSON.parse(row.images) as SiteImages
  const news = getPublishedNews()
  const water = getWaterSettings()
  const siteMeta = getSiteMeta()

  const taMerged = { ...ta, news: { ...(ta.news as object), items: newsToItems(news, 'ta') } }
  const enMerged = { ...en, news: { ...(en.news as object), items: newsToItems(news, 'en') } }

  // Sync hero water level label from water settings
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

export function getContactContent(): { ta: ContactSection; en: ContactSection } {
  const row = getSiteRow()
  const ta = JSON.parse(row.content_ta) as { contact: ContactSection }
  const en = JSON.parse(row.content_en) as { contact: ContactSection }
  return { ta: ta.contact, en: en.contact }
}

export function updateContact(ta: ContactSection, en: ContactSection) {
  const row = getSiteRow()
  const contentTa = JSON.parse(row.content_ta) as Record<string, unknown>
  const contentEn = JSON.parse(row.content_en) as Record<string, unknown>
  contentTa.contact = ta
  contentEn.contact = en

  db.prepare(
    `UPDATE site_content SET content_ta = ?, content_en = ?, updated_at = datetime('now') WHERE id = 1`,
  ).run(JSON.stringify(contentTa), JSON.stringify(contentEn))
}

function updateSection(key: string, ta: unknown, en: unknown) {
  const row = getSiteRow()
  const contentTa = JSON.parse(row.content_ta) as Record<string, unknown>
  const contentEn = JSON.parse(row.content_en) as Record<string, unknown>
  contentTa[key] = ta
  contentEn[key] = en
  db.prepare(
    `UPDATE site_content SET content_ta = ?, content_en = ?, updated_at = datetime('now') WHERE id = 1`,
  ).run(JSON.stringify(contentTa), JSON.stringify(contentEn))
}

export function getLeadersContent() {
  const row = getSiteRow()
  const ta = JSON.parse(row.content_ta) as { leaders: Record<string, unknown> }
  const en = JSON.parse(row.content_en) as { leaders: Record<string, unknown> }
  return { ta: ta.leaders, en: en.leaders }
}

export function updateLeaders(ta: Record<string, unknown>, en: Record<string, unknown>) {
  updateSection('leaders', ta, en)
}

export function getDemandsContent() {
  const row = getSiteRow()
  const ta = JSON.parse(row.content_ta) as { demands: Record<string, unknown> }
  const en = JSON.parse(row.content_en) as { demands: Record<string, unknown> }
  return { ta: ta.demands, en: en.demands }
}

export function updateDemands(ta: Record<string, unknown>, en: Record<string, unknown>) {
  updateSection('demands', ta, en)
}

export function getPublishedNewsById(id: string) {
  return db
    .prepare(`SELECT * FROM news_posts WHERE id = ? AND is_published = 1`)
    .get(id) as NewsPostRow | undefined
}

export function listAllNews() {
  return db
    .prepare(`SELECT * FROM news_posts ORDER BY sort_order ASC, published_at DESC`)
    .all() as NewsPostRow[]
}

export function getNewsById(id: string) {
  return db.prepare(`SELECT * FROM news_posts WHERE id = ?`).get(id) as NewsPostRow | undefined
}

export function createNews(data: Omit<NewsPostRow, 'created_at' | 'updated_at'>) {
  db.prepare(
    `INSERT INTO news_posts (id, tag_ta, tag_en, published_at, title_ta, title_en, body_ta, body_en, image_url, media_type, is_published, sort_order)
     VALUES (@id, @tag_ta, @tag_en, @published_at, @title_ta, @title_en, @body_ta, @body_en, @image_url, @media_type, @is_published, @sort_order)`,
  ).run({
    ...data,
    media_type: data.media_type ?? 'image',
  })
  return getNewsById(data.id)
}

export function updateNews(id: string, data: Partial<NewsPostRow>) {
  const existing = getNewsById(id)
  if (!existing) return undefined

  const merged = { ...existing, ...data, id, updated_at: new Date().toISOString() }
  db.prepare(
    `UPDATE news_posts SET
      tag_ta = @tag_ta, tag_en = @tag_en, published_at = @published_at,
      title_ta = @title_ta, title_en = @title_en, body_ta = @body_ta, body_en = @body_en,
      image_url = @image_url, media_type = @media_type, is_published = @is_published, sort_order = @sort_order,
      updated_at = datetime('now')
     WHERE id = @id`,
  ).run({
    ...merged,
    media_type: merged.media_type ?? 'image',
  })
  return getNewsById(id)
}

export function deleteNews(id: string) {
  const result = db.prepare(`DELETE FROM news_posts WHERE id = ?`).run(id)
  return result.changes > 0
}

export function listSubmissions(status?: string) {
  if (status) {
    return db
      .prepare(`SELECT * FROM join_submissions WHERE status = ? ORDER BY created_at DESC`)
      .all(status) as JoinSubmissionRow[]
  }
  return db
    .prepare(`SELECT * FROM join_submissions ORDER BY created_at DESC`)
    .all() as JoinSubmissionRow[]
}

export function getSubmissionById(id: string) {
  return db.prepare(`SELECT * FROM join_submissions WHERE id = ?`).get(id) as
    | JoinSubmissionRow
    | undefined
}

export function createSubmission(data: {
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
  db.prepare(
    `INSERT INTO join_submissions (id, name, father_name, village, phone, aadhaar, email, status, source)
     VALUES (@id, @name, @father_name, @village, @phone, @aadhaar, @email, @status, @source)`,
  ).run({
    ...data,
    status: data.status ?? 'new',
    source: data.source ?? 'website',
  })
  return getSubmissionById(data.id)
}

export function updateSubmission(
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
  const existing = getSubmissionById(id)
  if (!existing) return undefined

  db.prepare(
    `UPDATE join_submissions SET
      name = @name,
      father_name = @father_name,
      village = @village,
      phone = @phone,
      aadhaar = @aadhaar,
      email = @email,
      status = @status,
      notes = @notes,
      updated_at = datetime('now')
     WHERE id = @id`,
  ).run({
    id,
    name: data.name ?? existing.name,
    father_name: data.father_name ?? existing.father_name,
    village: data.village ?? existing.village,
    phone: data.phone ?? existing.phone,
    aadhaar: data.aadhaar ?? existing.aadhaar,
    email: data.email ?? existing.email,
    status: data.status ?? existing.status,
    notes: data.notes !== undefined ? data.notes : existing.notes,
  })
  return getSubmissionById(id)
}

export function deleteSubmission(id: string) {
  const result = db.prepare(`DELETE FROM join_submissions WHERE id = ?`).run(id)
  return result.changes > 0
}

export function getDashboardStats() {
  const submissions = db
    .prepare(`SELECT COUNT(*) as count FROM join_submissions WHERE status = 'new'`)
    .get() as { count: number }
  const news = db
    .prepare(`SELECT COUNT(*) as count FROM news_posts WHERE is_published = 1`)
    .get() as { count: number }
  const total = db.prepare(`SELECT COUNT(*) as count FROM join_submissions`).get() as { count: number }
  const water = getWaterSettings()
  return {
    newSubmissions: submissions.count,
    publishedNews: news.count,
    totalSubmissions: total.count,
    waterLevel: water.currentLevel,
    waterTarget: water.targetLevel,
    waterCapacity: water.capacity,
    waterStatus: water.status,
  }
}
