import { Alert } from '@mui/material'
import type { ReactNode } from 'react'

interface MpCalloutProps {
  children: ReactNode
  tone?: 'info' | 'neutral'
}

export function MpCallout({ children, tone = 'info' }: MpCalloutProps) {
  if (tone === 'neutral') {
    return (
      <Alert severity="info" icon={false} sx={{ bgcolor: '#f1f6f2', color: '#5a6b61', '& .MuiAlert-message': { width: '100%' } }}>
        {children}
      </Alert>
    )
  }
  return (
    <Alert severity="info" icon={false} sx={{ bgcolor: '#eaf4ff', color: '#2c6fb5', '& .MuiAlert-message': { width: '100%' } }}>
      {children}
    </Alert>
  )
}
