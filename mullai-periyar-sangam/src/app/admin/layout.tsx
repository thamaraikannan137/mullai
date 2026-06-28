'use client'

import { MullaiThemeProvider } from '@/ui'
import { AuthProvider } from '@/admin/context/AuthContext'
import { AdminLanguageProvider } from '@/admin/context/AdminLanguageContext'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MullaiThemeProvider>
      <AdminLanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </AdminLanguageProvider>
    </MullaiThemeProvider>
  )
}
