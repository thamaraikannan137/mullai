import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type AdminLang = 'ta' | 'en'

const STORAGE_KEY = 'mp-admin-lang'

interface AdminLanguageContextValue {
  lang: AdminLang
  setLang: (lang: AdminLang) => void
  toggleLang: () => void
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null)

function getInitialLang(): AdminLang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ta' || stored === 'en') return stored
  return 'ta'
}

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(getInitialLang)

  const setLang = (next: AdminLang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const toggleLang = () => setLang(lang === 'ta' ? 'en' : 'ta')

  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
  }, [lang])

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const ctx = useContext(AdminLanguageContext)
  if (!ctx) throw new Error('useAdminLanguage must be used within AdminLanguageProvider')
  return ctx
}

/** Bilingual label helper — Tamil shows primary TA; English shows EN only. */
export function adminLabel(ta: string, en: string, lang: AdminLang) {
  return lang === 'ta' ? ta : en
}
