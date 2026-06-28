import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  TextField,
  Button,
  InputAdornment,
  Badge,
  Avatar,
  Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AdminLogo } from '../components/AdminLogo'
import { NavIcon } from '../components/NavIcon'
import { mp } from '../../ui/designTokens'
import { AdminLanguageSwitcher } from '../components/AdminLanguageSwitcher'
import { useAuth } from '../context/AuthContext'
import { adminLabel, useAdminLanguage, type AdminLang } from '../context/AdminLanguageContext'
import { AdminSearchProvider } from '../context/AdminSearchContext'
import { ToastProvider } from '../context/ToastContext'
import { getPageMeta } from './pageMeta'
import { api } from '../lib/api'

const DRAWER_WIDTH = 270

const navItems = [
  { to: '/admin', end: true, ta: 'முகப்பு', en: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/members', ta: 'உறுப்பினர்கள்', en: 'Members', icon: 'members', badgeKey: 'pending' as const },
  { to: '/admin/news', ta: 'செய்திகள்', en: 'News', icon: 'news' },
  { to: '/admin/content', ta: 'பக்க உள்ளடக்கம்', en: 'Page Content', icon: 'news' },
  { to: '/admin/leaders', ta: 'தலைவர்கள்', en: 'Leadership', icon: 'leaders' },
  { to: '/admin/demands', ta: 'கோரிக்கைகள்', en: 'Demands', icon: 'demands' },
  { to: '/admin/water', ta: 'நீர்மட்டம்', en: 'Water Level', icon: 'water' },
  { to: '/admin/settings', ta: 'தொடர்பு & அமைப்பு', en: 'Contact & Settings', icon: 'settings' },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { lang } = useAdminLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const meta = getPageMeta(pathname)
  const [pendingCount, setPendingCount] = useState(0)
  const [search, setSearch] = useState('')

  const pageTitle = adminLabel(meta.ta, meta.en, lang)
  const pageSubtitle = lang === 'ta' ? meta.en : ''
  const addLabel = lang === 'ta' ? meta.addLabel : meta.addLabelEn ?? meta.addLabel
  const searchPlaceholder =
    lang === 'ta'
      ? meta.searchPlaceholderTa ?? 'தேடுங்கள்...'
      : meta.searchPlaceholderEn ?? 'Search...'

  useEffect(() => {
    api.listSubmissions('new').then((rows) => setPendingCount(rows.length)).catch(() => {})
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const initial = user?.name?.trim().charAt(0) || user?.email?.charAt(0).toUpperCase() || 'ந'

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'footer.main', color: 'footer.contrastText' }}>
      <Box sx={{ height: 3, background: 'linear-gradient(90deg, #e6b130, #23c483, #067a52)' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6, px: 2.75, pt: 3.25, pb: 2.75, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <AdminLogo />
        <Box>
          <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700, fontSize: 15, color: '#fbfcfa' }}>
            முல்லைப் பெரியாறு
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 10.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'secondary.main', mt: 0.4 }}>
            Admin Console
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.75, py: 2.25 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#5f7e6e', px: 1.5, mb: 1.25, mt: 0.5 }}>
          {adminLabel('நிர்வாகம்', 'Management', lang)}
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to)
            return (
              <ListItemButton
                key={item.to}
                component={Link}
                href={item.to}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.4,
                  py: 1.4,
                  pl: 2,
                  color: active ? 'secondary.light' : '#9fbbab',
                  bgcolor: active ? 'rgba(230,177,48,0.14)' : 'transparent',
                  '&:hover': { bgcolor: active ? 'rgba(230,177,48,0.14)' : 'rgba(255,255,255,0.04)' },
                  borderLeft: active ? '3px solid' : '3px solid transparent',
                  borderColor: active ? 'secondary.main' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <NavIcon name={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={adminLabel(item.ta, item.en, lang)}
                  secondary={lang === 'ta' ? item.en : undefined}
                  slotProps={{
                    primary: { sx: { fontSize: 14.5, fontWeight: 600 } },
                    secondary: {
                      sx: {
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 11,
                        color: active ? 'rgba(243,227,179,0.65)' : '#5f7e6e',
                      },
                    },
                  }}
                />
                {item.badgeKey === 'pending' && pendingCount > 0 && (
                  <Badge badgeContent={pendingCount} color="secondary" sx={{ '& .MuiBadge-badge': { bgcolor: 'secondary.main', color: 'footer.main', fontWeight: 700 } }} />
                )}
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.25, py: 2 }}>
        <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #067a52, #064e3b)', fontFamily: '"Cormorant Garamond", serif', color: '#f3e3b3' }}>
          {initial}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, color: '#fbfcfa' }}>
            {user?.name || adminLabel('நிர்வாகி', 'Administrator', lang)}
          </Typography>
          <Typography sx={{ fontSize: 12, fontFamily: '"Cormorant Garamond", serif', color: '#7e9a8b' }}>
            {adminLabel('நிர்வாகி', 'Administrator', lang)}
          </Typography>
        </Box>
        <Button size="small" onClick={handleLogout} sx={{ color: 'secondary.main', minWidth: 'auto', fontSize: 12 }}>
          {adminLabel('விடுபதிகை', 'Log out', lang)}
        </Button>
      </Box>
    </Box>
  )

  return (
    <ToastProvider>
      <Box className="admin-shell" sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
          }}
        >
          {drawer}
        </Drawer>

        <Box component="main" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: 'rgba(244,246,243,0.86)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid #e1eae3',
              color: 'text.primary',
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', gap: 3, minHeight: 'auto', py: '22px', px: '34px' }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  noWrap
                  sx={{ fontFamily: mp.fontSerif, fontSize: 25, fontWeight: 700, color: mp.greenDark, lineHeight: 1.2 }}
                >
                  {pageTitle}
                </Typography>
                {pageSubtitle && (
                  <Typography
                    sx={{
                      fontFamily: mp.fontAccent,
                      fontSize: 14,
                      fontStyle: 'italic',
                      color: mp.textSubtle,
                      mt: 0.5,
                    }}
                  >
                    {pageSubtitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AdminLanguageSwitcher />
                {meta.showSearch && (
                  <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    sx={{
                      minWidth: 260,
                      '& .MuiOutlinedInput-root': {
                        height: mp.headerBtnHeight,
                        borderRadius: `${mp.radiusSm}px`,
                        fontSize: 14.5,
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: mp.textSubtle }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
                {meta.showAdd && meta.addTo && addLabel && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={() => router.push(meta.addTo!)}
                    sx={{
                      height: mp.headerBtnHeight,
                      px: '20px',
                      borderRadius: `${mp.radiusSm}px`,
                      bgcolor: mp.greenMid,
                      fontSize: 14.5,
                      fontWeight: 600,
                      boxShadow: mp.shadowBtn,
                      '&:hover': { bgcolor: mp.greenDark, boxShadow: mp.shadowBtn },
                    }}
                  >
                    {addLabel}
                  </Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, px: 4, pt: 3.75, pb: 7 }}>
            <AdminSearchProvider search={search} lang={lang}>
              {children}
            </AdminSearchProvider>
          </Box>
        </Box>
      </Box>
    </ToastProvider>
  )
}

export { useAdminSearch } from '../context/AdminSearchContext'
