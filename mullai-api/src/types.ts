export type Lang = 'ta' | 'en'

export interface User {
  id: string
  email: string
  name: string | null
  role: 'super_admin' | 'editor' | 'viewer'
  is_active: number
  created_at: string
}

export interface NewsPostRow {
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
  is_published: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface JoinSubmissionRow {
  id: string
  name: string
  father_name: string
  village: string
  phone: string
  aadhaar: string
  email: string
  status: 'new' | 'contacted' | 'archived'
  source: 'website' | 'manual'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface HeroSlide {
  type: 'image' | 'video'
  src: string
  poster?: string
  alt: string
}

export interface SiteImages {
  about: string
  join: string
  presidentPhoto: string
}

export interface ContactSection {
  sectionLabel: string
  title: string
  description: string
  hours: string
  items: Array<{
    label: string
    value: string
    icon: 'phone' | 'email' | 'location'
  }>
}

export interface PublicContentResponse {
  ta: Record<string, unknown>
  en: Record<string, unknown>
  heroSlides: HeroSlide[]
  images: SiteImages
  water: WaterSettings
  siteMeta: SiteMeta
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

export interface JwtPayload {
  userId: string
  email: string
  role: string
}
