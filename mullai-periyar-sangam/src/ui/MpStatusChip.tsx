import { Box } from '@mui/material'
import { mp } from './designTokens'

export type MpChipTone = 'success' | 'warning' | 'info' | 'neutral'

const toneStyles: Record<MpChipTone, { bg: string; color: string }> = {
  success: { bg: '#e6f6ee', color: mp.greenMid },
  warning: { bg: '#fbf1d8', color: '#9a6b00' },
  info: { bg: '#eaf4ff', color: '#2c6fb5' },
  neutral: { bg: mp.surfaceMuted, color: mp.textMuted },
}

interface MpStatusChipProps {
  label: string
  tone?: MpChipTone
}

/** Pill badge matching design exactly */
export function MpStatusChip({ label, tone = 'neutral' }: MpStatusChipProps) {
  const { bg, color } = toneStyles[tone]
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        fontSize: '12.5px',
        fontWeight: 600,
        color,
        bgcolor: bg,
        px: '13px',
        py: '5px',
        borderRadius: mp.radiusPill,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  )
}
