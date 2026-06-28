import type { DemandsSection, LeadersSection } from '../types/content'
import type { HeroSlide } from '../../data/heroSlides'
import { API_URL } from '../../lib/api-base'

export type { LeadersSection, DemandsSection } from '../types/content'
const TOKEN_KEY = 'mp-admin-token'

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

export interface OrgSettings {
  siteNameLines: string[]
  description: string
  tagline: string
  copyright: string
}

export interface SiteImages {
  about: string
  join: string
  presidentPhoto: string
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data as T
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
}

export interface NewsPost {
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
}

export interface Submission {
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
}

export interface ContactData {
  sectionLabel: string
  title: string
  description: string
  hours: string
  items: Array<{ label: string; value: string; icon: 'phone' | 'email' | 'location' }>
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: AdminUser }>('/api/admin/auth/me'),

  dashboard: () =>
    request<{
      newSubmissions: number
      publishedNews: number
      totalSubmissions: number
      waterLevel: number
      waterTarget: number
      waterCapacity: number
      waterStatus: string
    }>('/api/admin/dashboard'),

  getWater: () => request<WaterSettings>('/api/admin/water'),
  updateWater: (body: WaterSettings) =>
    request<{ ok: boolean }>('/api/admin/water', { method: 'PUT', body: JSON.stringify(body) }),

  getSiteMeta: () => request<SiteMeta>('/api/admin/site-meta'),
  updateSiteMeta: (body: SiteMeta) =>
    request<{ ok: boolean }>('/api/admin/site-meta', { method: 'PUT', body: JSON.stringify(body) }),

  getOrg: () => request<{ ta: OrgSettings; en: OrgSettings }>('/api/admin/org'),
  updateOrg: (body: { ta: OrgSettings; en: OrgSettings }) =>
    request<{ ok: boolean }>('/api/admin/org', { method: 'PUT', body: JSON.stringify(body) }),

  getImages: () => request<SiteImages>('/api/admin/images'),
  updateImages: (body: SiteImages) =>
    request<{ ok: boolean }>('/api/admin/images', { method: 'PUT', body: JSON.stringify(body) }),

  getHeroSlides: () => request<HeroSlide[]>('/api/admin/hero-slides'),
  updateHeroSlides: (slides: HeroSlide[]) =>
    request<{ ok: boolean }>('/api/admin/hero-slides', { method: 'PUT', body: JSON.stringify(slides) }),

  getContentSection: <T>(section: string) => request<{ ta: T; en: T }>(`/api/admin/content/${section}`),
  updateContentSection: <T>(section: string, body: { ta: T; en: T }) =>
    request<{ ok: boolean }>(`/api/admin/content/${section}`, { method: 'PUT', body: JSON.stringify(body) }),

  listNews: () => request<NewsPost[]>('/api/admin/news'),
  getNews: (id: string) => request<NewsPost>(`/api/admin/news/${id}`),
  createNews: (body: Omit<NewsPost, 'id'>) =>
    request<NewsPost>('/api/admin/news', { method: 'POST', body: JSON.stringify(body) }),
  updateNews: (id: string, body: Partial<NewsPost>) =>
    request<NewsPost>(`/api/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteNews: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/news/${id}`, { method: 'DELETE' }),

  getContact: () => request<{ ta: ContactData; en: ContactData }>('/api/admin/contact'),
  updateContact: (body: { ta: ContactData; en: ContactData }) =>
    request<{ ok: boolean }>('/api/admin/contact', { method: 'PUT', body: JSON.stringify(body) }),

  getLeaders: () => request<{ ta: LeadersSection; en: LeadersSection }>('/api/admin/leaders'),
  updateLeaders: (body: { ta: LeadersSection; en: LeadersSection }) =>
    request<{ ok: boolean }>('/api/admin/leaders', { method: 'PUT', body: JSON.stringify(body) }),

  getDemands: () => request<{ ta: DemandsSection; en: DemandsSection }>('/api/admin/demands'),
  updateDemands: (body: { ta: DemandsSection; en: DemandsSection }) =>
    request<{ ok: boolean }>('/api/admin/demands', { method: 'PUT', body: JSON.stringify(body) }),

  listSubmissions: (status?: string) =>
    request<Submission[]>(`/api/admin/submissions${status ? `?status=${status}` : ''}`),

  createSubmission: (body: {
    name: string
    father_name: string
    village: string
    phone: string
    aadhaar: string
    email: string
    status?: Submission['status']
  }) =>
    request<Submission>('/api/admin/submissions', { method: 'POST', body: JSON.stringify(body) }),

  updateSubmission: (
    id: string,
    body: {
      name?: string
      father_name?: string
      village?: string
      phone?: string
      aadhaar?: string
      email?: string
      status?: Submission['status']
      notes?: string | null
    },
  ) =>
    request<Submission>(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  deleteSubmission: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/submissions/${id}`, { method: 'DELETE' }),
}
