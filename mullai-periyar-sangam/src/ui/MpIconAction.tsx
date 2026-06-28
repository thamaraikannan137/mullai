import { IconButton } from '@mui/material'
import type { ReactNode } from 'react'
import { mp } from './designTokens'

type MpIconActionVariant = 'approve' | 'edit' | 'delete'

const styles: Record<MpIconActionVariant, object> = {
  approve: {
    bgcolor: '#e6f6ee',
    color: mp.greenMid,
    border: 'none',
    '&:hover': { bgcolor: mp.greenMid, color: '#fbfcfa' },
  },
  edit: {
    bgcolor: '#fff',
    color: mp.textMuted,
    border: `1px solid ${mp.border}`,
    '&:hover': { borderColor: mp.greenMid, color: mp.greenMid },
  },
  delete: {
    bgcolor: '#fff',
    color: mp.textMuted,
    border: `1px solid ${mp.border}`,
    '&:hover': { borderColor: '#c2412d', color: '#c2412d', bgcolor: '#fbeeec' },
  },
}

interface MpIconActionProps {
  variant: MpIconActionVariant
  title: string
  onClick: () => void
  children: ReactNode
}

export function MpIconAction({ variant, title, onClick, children }: MpIconActionProps) {
  return (
    <IconButton
      size="small"
      title={title}
      onClick={onClick}
      sx={{
        width: 32,
        height: 32,
        borderRadius: '8px',
        ...styles[variant],
      }}
    >
      {children}
    </IconButton>
  )
}
