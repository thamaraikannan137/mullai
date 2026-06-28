import { Box, Button } from '@mui/material'
import { mp } from './designTokens'

export interface MpFilterOption<T extends string> {
  key: T
  label: string
  count: number
}

interface MpFilterChipsProps<T extends string> {
  options: MpFilterOption<T>[]
  value: T
  onChange: (key: T) => void
}

/** Exact match to design filter chip buttons */
export function MpFilterChips<T extends string>({ options, value, onChange }: MpFilterChipsProps<T>) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mb: '18px' }}>
      {options.map((opt) => {
        const active = value === opt.key
        return (
          <Button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            disableElevation
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '13.5px',
              fontWeight: 600,
              px: '16px',
              py: '9px',
              borderRadius: `${mp.radiusSm}px`,
              textTransform: 'none',
              minHeight: 'auto',
              ...(active
                ? {
                    bgcolor: mp.greenDark,
                    color: '#fbfcfa',
                    border: `1px solid ${mp.greenDark}`,
                    '&:hover': { bgcolor: mp.greenDark },
                  }
                : {
                    bgcolor: '#fff',
                    color: mp.textBody,
                    border: `1px solid ${mp.borderInput}`,
                    '&:hover': { bgcolor: '#fff', borderColor: mp.borderInput },
                  }),
            }}
          >
            {opt.label}
            <Box
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                minWidth: 20,
                px: '7px',
                py: '1px',
                borderRadius: mp.radiusPill,
                bgcolor: active ? 'rgba(255,255,255,0.2)' : mp.surfaceMuted,
                color: active ? '#f3e3b3' : mp.textMuted,
              }}
            >
              {opt.count}
            </Box>
          </Button>
        )
      })}
    </Box>
  )
}
