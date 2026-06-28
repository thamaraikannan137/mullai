import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button } from '@mui/material'
import { AdminLogo } from '../components/AdminLogo'
import { AdminLanguageSwitcher } from '../components/AdminLanguageSwitcher'
import { useAuth } from '../context/AuthContext'
import { adminLabel, useAdminLanguage } from '../context/AdminLanguageContext'
import { MpFormField, mp } from '../../ui'

export function LoginPage() {
  const { user, login } = useAuth()
  const { lang } = useAdminLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : adminLabel('உள்நுழைவு தோல்வி', 'Login failed', lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="admin-shell" sx={{ display: 'flex', minHeight: '100vh', bgcolor: mp.shellBg }}>
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: mp.sidebarWidth,
          flexShrink: 0,
          flexDirection: 'column',
          bgcolor: mp.sidebarBg,
          color: '#c9dfcf',
        }}
      >
        <Box sx={{ height: 3, background: 'linear-gradient(90deg, #e6b130, #23c483, #067a52)' }} />
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', px: 4 }}>
          <AdminLogo size={56} />
          <Typography sx={{ fontFamily: mp.fontSerif, mt: 3, fontSize: 24, fontWeight: 700, color: '#fbfcfa' }}>
            முல்லைப் பெரியாறு
          </Typography>
          <Typography sx={{ fontFamily: mp.fontAccent, mt: 1, fontSize: 14, letterSpacing: '2.5px', textTransform: 'uppercase', color: mp.gold }}>
            Admin Console
          </Typography>
          <Typography sx={{ mt: 3, fontSize: 14, lineHeight: 1.6, color: '#9fbbab' }}>
            {adminLabel(
              'சங்க அலுவலக staff மட்டும் — உறுப்பினர்கள், செய்திகள், தள உள்ளடக்கத்தை நிர்வகிக்க.',
              'Association office staff only — manage members, news, and site content.',
              lang,
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 6 }}>
        <Box sx={{ position: 'absolute', right: 24, top: 24 }}>
          <AdminLanguageSwitcher />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 448,
            borderRadius: '20px',
            border: `1px solid ${mp.border}`,
            bgcolor: '#fff',
            p: 4,
            boxShadow: '0 10px 30px rgba(5,70,50,0.08)',
          }}
        >
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <AdminLogo size={40} />
            <Box>
              <Typography sx={{ fontFamily: mp.fontSerif, fontWeight: 700, color: mp.greenDark }}>முல்லைப் பெரியாறு</Typography>
              <Typography sx={{ fontFamily: mp.fontAccent, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: mp.gold }}>
                Admin Console
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ fontFamily: mp.fontSerif, fontSize: 22, fontWeight: 700, color: mp.greenDark }}>
            {adminLabel('நிர்வாகி உள்நுழைவு', 'Administrator sign in', lang)}
          </Typography>
          {lang === 'ta' && (
            <Typography sx={{ fontFamily: mp.fontAccent, mt: 0.5, fontSize: 14, fontStyle: 'italic', color: mp.textSubtle }}>
              Administrator sign in
            </Typography>
          )}

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <MpFormField labelTa="மின்னஞ்சல்" labelEn="Email">
              <TextField type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </MpFormField>
            <MpFormField labelTa="கடவுச்சொல்" labelEn="Password">
              <TextField type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </MpFormField>
            {error && <Typography sx={{ fontSize: 14, color: '#dc2626' }}>{error}</Typography>}
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              sx={{
                mt: 1,
                borderRadius: `${mp.radiusSm}px`,
                bgcolor: mp.greenMid,
                py: '15px',
                fontSize: 15,
                fontWeight: 600,
                color: '#fbfcfa',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(6,122,82,0.22)',
                '&:hover': { bgcolor: mp.greenDark, boxShadow: '0 8px 20px rgba(6,122,82,0.22)' },
                '&.Mui-disabled': { opacity: 0.6, color: '#fbfcfa' },
              }}
            >
              {loading ? '…' : adminLabel('உள்நுழை', 'Sign in', lang)}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
