import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { images, president } from '../data/content'
import { heroSlides as staticHeroSlides } from '../data/heroSlides'
import { fetchPublicContent, applySeo, type SiteMeta, type WaterSettings } from '../lib/public-api'
import type { HeroSlide } from '../data/heroSlides'
import { translations, type Lang, type Translations } from './translations'

const STORAGE_KEY = 'mp-lang'

export interface SiteImages {
  about: string
  join: string
  presidentPhoto: string
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
    descriptionTa: '',
    descriptionEn: '',
  },
  about: { districtCount: 5, badgeYear: 1895 },
  social: { facebook: '', instagram: '', youtube: '' },
}

interface LanguageContextValue {
  lang: Lang
  t: Translations
  heroSlides: HeroSlide[]
  images: SiteImages
  water: WaterSettings
  siteMeta: SiteMeta
  contentReady: boolean
  contentFromApi: boolean
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const defaultImages: SiteImages = {
  about: images.about,
  join: images.join,
  presidentPhoto: president.photo,
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ta'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ta' || stored === 'en') return stored
  return 'ta'
}

function mergeTranslations(api: Translations, fallback: Translations): Translations {
  return {
    ...api,
    join: { ...fallback.join, ...api.join },
    footer: { ...fallback.footer, ...api.footer },
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)
  const [contentTa, setContentTa] = useState<Translations>(translations.ta)
  const [contentEn, setContentEn] = useState<Translations>(translations.en)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(staticHeroSlides)
  const [siteImages, setSiteImages] = useState<SiteImages>(defaultImages)
  const [water, setWater] = useState<WaterSettings>(DEFAULT_WATER)
  const [siteMeta, setSiteMeta] = useState<SiteMeta>(DEFAULT_META)
  const [contentReady, setContentReady] = useState(false)
  const [contentFromApi, setContentFromApi] = useState(false)

  const setLang = (next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const toggleLang = () => setLang(lang === 'ta' ? 'en' : 'ta')

  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
    applySeo(lang, siteMeta)
  }, [lang, siteMeta])

  useEffect(() => {
    let cancelled = false

    fetchPublicContent()
      .then((data) => {
        if (cancelled) return
        setContentTa(mergeTranslations(data.ta, translations.ta))
        setContentEn(mergeTranslations(data.en, translations.en))
        setHeroSlides(data.heroSlides)
        setWater(data.water)
        setSiteMeta(data.siteMeta)
        setSiteImages({
          about: data.images.about || defaultImages.about,
          join: data.images.join || defaultImages.join,
          presidentPhoto:
            data.images.presidentPhoto && !data.images.presidentPhoto.startsWith('/assets/')
              ? data.images.presidentPhoto
              : defaultImages.presidentPhoto,
        })
        setContentFromApi(true)
      })
      .catch(() => {
        if (cancelled) return
        setContentFromApi(false)
      })
      .finally(() => {
        if (!cancelled) setContentReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const t = lang === 'ta' ? contentTa : contentEn

  if (!contentReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F2E8]">
        <div className="font-tamil-serif text-lg text-green-dark">…</div>
      </div>
    )
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t,
        heroSlides,
        images: siteImages,
        water,
        siteMeta,
        contentReady,
        contentFromApi,
        setLang,
        toggleLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
