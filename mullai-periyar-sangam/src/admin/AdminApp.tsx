import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { MullaiThemeProvider } from '../ui'
import { AuthProvider } from './context/AuthContext'
import { AdminLanguageProvider } from './context/AdminLanguageContext'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from './layout/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { MembersPage } from './pages/MembersPage'
import { NewsPage } from './pages/NewsPage'
import { SettingsPage } from './pages/SettingsPage'
import { WaterPage } from './pages/WaterPage'
import { LeadersPage } from './pages/LeadersPage'
import { DemandsPage } from './pages/DemandsPage'
import { ContentPage } from './pages/ContentPage'

function AdminNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow')
    return () => {
      meta?.setAttribute('content', 'index, follow')
    }
  }, [])
  return null
}

export function AdminApp() {
  return (
    <MullaiThemeProvider>
      <AdminNoIndex />
      <AdminLanguageProvider>
        <AuthProvider>
          <Suspense
            fallback={
              <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <CircularProgress color="primary" />
              </Box>
            }
          >
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="submissions" element={<Navigate to="/admin/members" replace />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/new" element={<Navigate to="/admin/news?new=1" replace />} />
                <Route path="news/:id/edit" element={<Navigate to="/admin/news" replace />} />
                <Route path="leaders" element={<LeadersPage />} />
                <Route path="demands" element={<DemandsPage />} />
                <Route path="content" element={<ContentPage />} />
                <Route path="water" element={<WaterPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="contact" element={<Navigate to="/admin/settings" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          </Suspense>
        </AuthProvider>
      </AdminLanguageProvider>
    </MullaiThemeProvider>
  )
}
