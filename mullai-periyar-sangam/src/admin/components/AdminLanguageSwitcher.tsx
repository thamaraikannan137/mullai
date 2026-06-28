import { Button } from '@mui/material'
import { useAdminLanguage } from '../context/AdminLanguageContext'
import { mp } from '../../ui/designTokens'

export function AdminLanguageSwitcher() {
  const { lang, toggleLang } = useAdminLanguage()
  const label = lang === 'ta' ? 'EN' : 'TA'

  return (
    <Button
      onClick={toggleLang}
      aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
      title={lang === 'ta' ? 'English' : 'தமிழ்'}
      sx={{
        minWidth: 42,
        height: mp.headerBtnHeight,
        px: 1.5,
        borderRadius: `${mp.radiusSm}px`,
        border: `1px solid ${mp.borderInput}`,
        bgcolor: '#fff',
        color: mp.greenMid,
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': { borderColor: mp.greenMid, bgcolor: '#e6f6ee', boxShadow: 'none' },
      }}
    >
      {label}
    </Button>
  )
}
