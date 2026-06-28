import { useEffect, useState } from 'react'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import { AdminFormField } from '../components/AdminFormField'
import { useToast } from '../context/ToastContext'
import { api, type WaterSettings } from '../lib/api'
import { useAdminT } from '../i18n/ui'
import { MpCard } from '../../ui'

export function WaterPage() {
  const { c, water: w } = useAdminT()
  const { showToast, showError } = useToast()
  const [form, setForm] = useState<WaterSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getWater().then(setForm).catch((e) => showError(e.message))
  }, [showError])

  if (!form) {
    return <Typography sx={{ color: '#5a6b61' }}>{c.loading}</Typography>
  }

  const waterPercent = (form.currentLevel / form.capacity) * 100
  const targetPercent = (form.targetLevel / form.capacity) * 100
  const statusLabel = form.status === 'rising' ? w.rising : form.status === 'stable' ? w.stable : w.falling

  const save = async () => {
    setSaving(true)
    try {
      await api.updateWater(form)
      showToast(c.saved)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', maxWidth: 1000, gridTemplateColumns: { lg: '1fr 1.2fr' }, gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2.5,
          p: 4.25,
          color: '#fbfcfa',
          background: 'radial-gradient(130% 140% at 80% 0%, #0A8A5C 0%, #053D2C 75%)',
          boxShadow: '0 18px 44px rgba(5,70,50,0.18)',
        }}
      >
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#f3e3b3' }}>
          {w.livePreview}
        </Typography>
        <Box sx={{ mt: 3.5, display: 'flex', alignItems: 'flex-end', gap: 3.25 }}>
          <Box sx={{ position: 'relative', display: 'flex', height: 300, width: 80, flexDirection: 'column-reverse', overflow: 'hidden', borderRadius: 1.75, border: '1px solid rgba(230,177,48,0.3)', bgcolor: 'rgba(255,255,255,0.08)' }}>
            <Box sx={{ height: `${waterPercent}%`, background: 'linear-gradient(to top, #23c483, #0e9f6e)', boxShadow: '0 0 24px rgba(35,196,131,0.5)' }} />
            <Box sx={{ position: 'absolute', left: 0, right: 0, height: 2, bgcolor: 'secondary.main', bottom: `${targetPercent}%` }} />
          </Box>
          <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 56, fontWeight: 700, lineHeight: 0.9 }}>
              {form.currentLevel}
            </Typography>
            <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', mt: 0.75, fontSize: 15, color: '#cfe2d4' }}>
              {w.currentFeet}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ mt: 3.25, fontFamily: '"Cormorant Garamond", serif', fontSize: 13, fontStyle: 'italic', color: '#9cc4ae' }}>
          {w.lastUpdated} · {form.lastUpdatedTa} · {statusLabel}
        </Typography>
      </Box>

      <MpCard padding={4}>
        <Typography variant="h6" color="primary.dark">{w.updateTitle}</Typography>
        <Typography variant="subtitle2" sx={{ color: '#7c8a81', fontStyle: 'italic', mt: 0.5 }}>{w.updateDesc}</Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2.25 }}>
          <AdminFormField labelTa={w.current} labelEn={w.current}>
            <TextField type="number" value={form.currentLevel} onChange={(e) => setForm((f) => f && { ...f, currentLevel: Number(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa={w.target} labelEn={w.target}>
            <TextField type="number" value={form.targetLevel} onChange={(e) => setForm((f) => f && { ...f, targetLevel: Number(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa={w.capacity} labelEn={w.capacity}>
            <TextField type="number" value={form.capacity} onChange={(e) => setForm((f) => f && { ...f, capacity: Number(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa={w.trend} labelEn={w.trend}>
            <TextField select value={form.status} onChange={(e) => setForm((f) => f && { ...f, status: e.target.value as WaterSettings['status'] })}>
              <MenuItem value="rising">{w.rising}</MenuItem>
              <MenuItem value="stable">{w.stable}</MenuItem>
              <MenuItem value="falling">{w.falling}</MenuItem>
            </TextField>
          </AdminFormField>
        </Box>
        <AdminFormField labelTa={`${w.lastUpdated} (தமிழ்)`} labelEn="Last updated (Tamil)">
          <TextField value={form.lastUpdatedTa} onChange={(e) => setForm((f) => f && { ...f, lastUpdatedTa: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa={`${w.lastUpdated} (English)`} labelEn="Last updated (English)">
          <TextField value={form.lastUpdatedEn} onChange={(e) => setForm((f) => f && { ...f, lastUpdatedEn: e.target.value })} />
        </AdminFormField>
        <Button fullWidth variant="contained" color="primary" disabled={saving} sx={{ mt: 3.25 }} onClick={save}>
          {saving ? '…' : w.saveChanges}
        </Button>
      </MpCard>
    </Box>
  )
}
