'use client'

import { ProtectedRoute } from '@/admin/ProtectedRoute'
import { AdminLayout } from '@/admin/layout/AdminLayout'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
