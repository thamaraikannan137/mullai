'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { AdminLang } from '../context/AdminLanguageContext'

const AdminSearchContext = createContext<{ search: string; lang: AdminLang } | null>(null)

export function AdminSearchProvider({
  search,
  lang,
  children,
}: {
  search: string
  lang: AdminLang
  children: ReactNode
}) {
  return (
    <AdminSearchContext.Provider value={{ search, lang }}>{children}</AdminSearchContext.Provider>
  )
}

export function useAdminSearch() {
  const ctx = useContext(AdminSearchContext)
  if (!ctx) throw new Error('useAdminSearch must be used within AdminLayout')
  return ctx
}
