'use client'

import { LanguageProvider } from '@/i18n/LanguageContext'

export function PublicProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
