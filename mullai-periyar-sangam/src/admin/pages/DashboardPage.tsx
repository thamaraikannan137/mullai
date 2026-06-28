import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Typography, Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { api, type Submission } from '../lib/api'
import type { NewsPost } from '../lib/api'
import { useAdminT } from '../i18n/ui'
import { MpAvatar, MpStatusChip, mp } from '../../ui'

export function DashboardPage() {
  const { c, dashboard: d, lang } = useAdminT()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [news, setNews] = useState<NewsPost[]>([])
  const [stats, setStats] = useState({ waterLevel: 142, waterTarget: 152, waterCapacity: 152, waterStatus: 'rising' })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listSubmissions(), api.listNews(), api.dashboard()])
      .then(([s, n, dash]) => {
        setSubmissions(s)
        setNews(n.filter((x) => x.is_published))
        setStats({
          waterLevel: dash.waterLevel,
          waterTarget: dash.waterTarget,
          waterCapacity: dash.waterCapacity,
          waterStatus: dash.waterStatus,
        })
      })
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <Box sx={{ borderRadius: `${mp.radiusMd}px`, border: '1px solid #fecaca', bgcolor: '#fef2f2', p: 2, color: '#b91c1c' }}>
        {error}
      </Box>
    )
  }

  const pending = submissions.filter((s) => s.status === 'new').length
  const approved = submissions.length - pending
  const recent = [...submissions].slice(0, 5)
  const dateLocale = lang === 'ta' ? 'ta-IN' : 'en-IN'

  const statCards = [
    {
      value: submissions.length,
      unit: null as string | null,
      label: d.totalMembers,
      tag: `${approved} ${d.approvedCount}`,
      tagTone: 'success' as const,
      iconBg: '#E6F6EE',
      iconColor: '#067A52',
      Icon: PeopleIcon,
    },
    {
      value: pending,
      unit: null,
      label: d.pendingRegs,
      tag: pending > 0 ? d.needsAttention : d.done,
      tagTone: 'warning' as const,
      iconBg: '#FBF1D8',
      iconColor: '#BC8E1C',
      Icon: PendingActionsIcon,
    },
    {
      value: news.length,
      unit: null,
      label: d.publishedNews,
      tag: d.active,
      tagTone: 'success' as const,
      iconBg: '#EAF4FF',
      iconColor: '#2C6FB5',
      Icon: NewspaperIcon,
    },
    {
      value: stats.waterLevel,
      unit: c.feet,
      label: d.waterLevel,
      tag: stats.waterStatus === 'rising' ? d.rising : stats.waterStatus === 'stable' ? 'Stable' : 'Falling',
      tagTone: 'success' as const,
      iconBg: '#E6F6EE',
      iconColor: '#0E9F6E',
      Icon: WaterDropIcon,
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' }, gap: '20px' }}>
        {statCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              borderRadius: `${mp.radiusLg}px`,
              border: `1px solid ${mp.border}`,
              bgcolor: '#fff',
              p: '24px',
              boxShadow: mp.shadowCard,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: `${mp.radiusMd}px`,
                  bgcolor: card.iconBg,
                  color: card.iconColor,
                }}
              >
                <card.Icon sx={{ fontSize: 22 }} />
              </Box>
              <MpStatusChip label={card.tag} tone={card.tagTone} />
            </Box>
            <Box className="font-number" sx={{ mt: 2.5, display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
              <Typography
                component="span"
                sx={{ fontFamily: mp.fontAccent, fontSize: 38, fontWeight: 700, lineHeight: 1, color: mp.greenDark }}
              >
                {card.value}
              </Typography>
              {card.unit && (
                <Typography component="span" sx={{ fontFamily: mp.fontSerif, fontSize: 18, fontWeight: 600, color: mp.textMuted }}>
                  {card.unit}
                </Typography>
              )}
            </Box>
            <Typography sx={{ mt: 0.75, fontSize: 14, fontWeight: 500, color: mp.textPrimary }}>
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: '22px', display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.5fr 1fr' }, gap: '22px' }}>
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: `${mp.radiusLg}px`,
            border: `1px solid ${mp.border}`,
            bgcolor: '#fff',
            boxShadow: mp.shadowCard,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '26px', pt: '22px', pb: 2 }}>
            <Typography sx={{ fontFamily: mp.fontSerif, fontSize: 18, fontWeight: 700, color: mp.greenDark }}>
              {d.recentRegs}
            </Typography>
            <Button
              component={Link}
              href="/admin/members"
              sx={{
                fontSize: 13.5,
                fontWeight: 600,
                color: mp.greenMid,
                textTransform: 'none',
                minWidth: 'auto',
                p: 0,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              {c.viewAll}
            </Button>
          </Box>
          {recent.length === 0 ? (
            <Typography sx={{ px: '26px', pb: 3, fontSize: 14, color: mp.textSubtle }}>{d.noRegs}</Typography>
          ) : (
            recent.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderTop: `1px solid ${mp.borderLight}`,
                  px: '26px',
                  py: 1.75,
                }}
              >
                <MpAvatar name={row.name} size={40} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: mp.textDark }}>{row.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: mp.textSubtle }}>{row.village}</Typography>
                </Box>
                <Typography sx={{ fontFamily: mp.fontAccent, fontSize: 12.5, color: mp.textFaint }}>
                  {new Date(row.created_at).toLocaleDateString(dateLocale)}
                </Typography>
                <MpStatusChip
                  label={row.status === 'new' ? c.pending : c.approved}
                  tone={row.status === 'new' ? 'warning' : 'success'}
                />
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <Box
            sx={{
              borderRadius: `${mp.radiusLg}px`,
              background: 'radial-gradient(130% 140% at 85% 0%, #0A8A5C 0%, #064E3B 70%)',
              p: '24px 26px',
              color: '#fbfcfa',
              boxShadow: '0 10px 30px rgba(5,70,50,0.16)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: mp.fontAccent, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: '#f3e3b3' }}>
                {d.waterLevelTitle}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12.5, color: '#cfe2d4' }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#23c483', boxShadow: '0 0 0 3px rgba(35,196,131,0.25)' }} />
                {d.rising}
              </Box>
            </Box>
            <Box className="font-number" sx={{ mt: 2, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              <Typography component="span" sx={{ fontFamily: mp.fontAccent, fontSize: 46, fontWeight: 700, lineHeight: 0.9 }}>
                {stats.waterLevel}
              </Typography>
              <Typography component="span" sx={{ fontFamily: mp.fontSerif, mb: 0.75, fontSize: 16, color: '#cfe2d4' }}>
                {lang === 'ta' ? `அடி / ${stats.waterTarget} அடி இலக்கு` : `ft / ${stats.waterTarget} ft target`}
              </Typography>
            </Box>
            <Box sx={{ mt: 2, height: 9, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${Math.min(100, (stats.waterLevel / stats.waterCapacity) * 100)}%`, borderRadius: '6px', background: 'linear-gradient(to right, #23c483, #e6b130)' }} />
            </Box>
            <Button
              component={Link}
              href="/admin/water"
              fullWidth
              sx={{
                mt: '18px',
                borderRadius: '9px',
                border: '1px solid rgba(230,177,48,0.45)',
                bgcolor: 'rgba(255,255,255,0.06)',
                py: 1.25,
                fontSize: 13.5,
                fontWeight: 600,
                color: '#f3e3b3',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', boxShadow: 'none' },
              }}
            >
              {d.updateWater}
            </Button>
          </Box>

          <Box
            sx={{
              borderRadius: `${mp.radiusLg}px`,
              border: `1px solid ${mp.border}`,
              bgcolor: '#fff',
              p: '22px 24px',
              boxShadow: mp.shadowCard,
            }}
          >
            <Typography sx={{ fontFamily: mp.fontSerif, fontSize: 17, fontWeight: 700, color: mp.greenDark, mb: 1.75 }}>
              {d.recentNews}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {news.slice(0, 3).map((n) => (
                <Box key={n.id} sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ mt: 0.75, width: 9, height: 9, flexShrink: 0, borderRadius: '50%', bgcolor: mp.gold }} />
                  <Box>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, color: mp.textDark }}>
                      {lang === 'ta' ? n.title_ta : n.title_en}
                    </Typography>
                    <Typography sx={{ fontFamily: mp.fontAccent, mt: 0.5, fontSize: 12.5, color: mp.textFaint }}>
                      {lang === 'ta' ? n.tag_ta : n.tag_en} · {n.published_at}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
