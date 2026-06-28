import type { HeroSlide } from '../data/heroSlides'
import type { Translations } from '../i18n/translations'
import { API_URL } from './api-base'

export interface SiteImages {
  about: string
  join: string
  presidentPhoto: string
}

export interface WaterSettings {
  currentLevel: number
  targetLevel: number
  capacity: number
  status: 'rising' | 'stable' | 'falling'
  lastUpdatedTa: string
  lastUpdatedEn: string
}

export interface SiteMeta {
  seo: {
    titleTa: string
    titleEn: string
    descriptionTa: string
    descriptionEn: string
  }
  about: {
    districtCount: number
    badgeYear: number
  }
  social: {
    facebook: string
    instagram: string
    youtube: string
  }
}

export interface PublicContentResponse {
  ta: Translations
  en: Translations
  heroSlides: HeroSlide[]
  images: SiteImages
  water: WaterSettings
  siteMeta: SiteMeta
}

export async function fetchPublicContent(): Promise<PublicContentResponse> {
  const res = await fetch(`${API_URL}/api/public/content`)
  if (!res.ok) throw new Error(`Content API error (${res.status})`)
  return res.json() as Promise<PublicContentResponse>
}

export interface PublicNewsPost {
  id: string
  tag_ta: string
  tag_en: string
  published_at: string
  title_ta: string
  title_en: string
  body_ta: string
  body_en: string
  image_url: string
  media_type: 'image' | 'youtube'
}

export async function fetchPublicNews(id: string): Promise<PublicNewsPost> {
  const res = await fetch(`${API_URL}/api/public/news/${id}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `News API error (${res.status})`)
  }
  return res.json() as Promise<PublicNewsPost>
}

export async function submitJoin(data: {
  name: string
  father_name: string
  phone: string
  aadhaar: string
  village: string
  email: string
}): Promise<void> {
  const res = await fetch(`${API_URL}/api/public/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Submit failed (${res.status})`)
  }
}

export function applySeo(lang: 'ta' | 'en', siteMeta: SiteMeta) {
  setPageMeta({
    title: lang === 'ta' ? siteMeta.seo.titleTa : siteMeta.seo.titleEn,
    description: lang === 'ta' ? siteMeta.seo.descriptionTa : siteMeta.seo.descriptionEn,
  })
}

export function setPageMeta(opts: { title?: string; description?: string }) {
  if (opts.title) document.title = opts.title
  if (opts.description !== undefined) {
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', opts.description)
  }
}
