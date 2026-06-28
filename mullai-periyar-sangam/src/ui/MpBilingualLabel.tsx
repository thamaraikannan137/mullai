import { Typography, Box } from '@mui/material'
import { adminLabel, useAdminLanguage } from '../admin/context/AdminLanguageContext'

interface MpBilingualLabelProps {
  labelTa: string
  labelEn: string
  variant?: 'field' | 'title' | 'section'
}

export function MpBilingualLabel({ labelTa, labelEn, variant = 'field' }: MpBilingualLabelProps) {
  const { lang } = useAdminLanguage()
  const primary = adminLabel(labelTa, labelEn, lang)

  if (variant === 'title') {
    return (
      <Box>
        <Typography variant="h6" color="primary.dark" sx={{ fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 }}>
          {primary}
        </Typography>
        {lang === 'ta' && (
          <Typography variant="subtitle2" sx={{ color: '#7c8a81', fontStyle: 'italic', mt: 0.25 }}>
            {labelEn}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 600, letterSpacing: '0.2px' }}>
      {primary}
      {lang === 'ta' && variant === 'field' && (
        <Typography component="span" variant="body2" sx={{ color: '#9aa89f', fontStyle: 'italic', ml: 0.5 }}>
          · {labelEn}
        </Typography>
      )}
    </Typography>
  )
}
