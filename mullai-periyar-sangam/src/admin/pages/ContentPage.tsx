import { Fragment, useEffect, useState } from 'react'
import { Box, Button, Tab, Tabs, TextField, Typography, MenuItem } from '@mui/material'
import { AdminFormField } from '../components/AdminFormField'
import { useToast } from '../context/ToastContext'
import { api } from '../lib/api'
import type { HeroSlide } from '../../data/heroSlides'
import type { Translations } from '../../i18n/translations'
import { useAdminT } from '../i18n/ui'
import { MpCard, mp } from '../../ui'

type SectionKey = 'hero' | 'about' | 'quote' | 'footer' | 'join'

const tabs: { key: SectionKey | 'slides'; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'quote', label: 'Quote' },
  { key: 'footer', label: 'Footer' },
  { key: 'join', label: 'Join' },
  { key: 'slides', label: 'Hero slides' },
]

function linesToText(lines?: string[]) {
  return (lines ?? []).join('\n')
}

function textToLines(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function districtsToText(districts?: string[]) {
  return (districts ?? []).join(', ')
}

function textToDistricts(text: string) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function ContentPage() {
  const { c } = useAdminT()
  const { showToast, showError } = useToast()
  const [tab, setTab] = useState<string>('hero')
  const [loadedTab, setLoadedTab] = useState<string | null>(null)
  const [ta, setTa] = useState<Record<string, unknown> | null>(null)
  const [en, setEn] = useState<Record<string, unknown> | null>(null)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [saving, setSaving] = useState(false)
  const [sectionLoading, setSectionLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let alive = true
    setSectionLoading(true)
    setLoadError('')
    setLoadedTab(null)

    if (tab === 'slides') {
      api
        .getHeroSlides()
        .then((data) => {
          if (!alive) return
          setSlides(data)
          setLoadedTab('slides')
        })
        .catch((e) => {
          if (!alive) return
          const msg = e instanceof Error ? e.message : 'Failed to load slides'
          setLoadError(msg)
          showError(msg)
        })
        .finally(() => {
          if (alive) setSectionLoading(false)
        })
      return () => {
        alive = false
      }
    }

    api
      .getContentSection<Record<string, unknown>>(tab as SectionKey)
      .then(({ ta: t, en: e }) => {
        if (!alive) return
        setTa(t)
        setEn(e)
        setLoadedTab(tab)
      })
      .catch((e) => {
        if (!alive) return
        const msg = e instanceof Error ? e.message : 'Failed to load content'
        setLoadError(msg)
        showError(msg)
      })
      .finally(() => {
        if (alive) setSectionLoading(false)
      })

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const ready = !sectionLoading && loadedTab === tab && (tab === 'slides' || (ta != null && en != null))

  const saveSection = async () => {
    if (tab === 'slides') {
      setSaving(true)
      try {
        await api.updateHeroSlides(slides)
        showToast(c.saved)
      } catch (e) {
        showError(e instanceof Error ? e.message : 'Save failed')
      } finally {
        setSaving(false)
      }
      return
    }
    if (!ta || !en) return
    setSaving(true)
    try {
      await api.updateContentSection(tab, { ta, en })
      showToast(c.saved)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const renderHero = () => {
    const hTa = ta as Translations['hero']
    const hEn = en as Translations['hero']
    const statsTa = hTa.stats ?? []
    const statsEn = hEn.stats ?? []

    const updateStat = (lang: 'ta' | 'en', index: number, field: 'value' | 'label', value: string) => {
      const base = lang === 'ta' ? statsTa : statsEn
      const next = base.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      if (lang === 'ta') setTa({ ...hTa, stats: next })
      else setEn({ ...hEn, stats: next })
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <AdminFormField labelTa="தலைப்பு வரிகள் (தமிழ்)" labelEn="Title lines (Tamil)">
            <TextField multiline minRows={3} value={linesToText(hTa.titleLines)} onChange={(e) => setTa({ ...hTa, titleLines: textToLines(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa="Title lines (English)" labelEn="Title lines (English)">
            <TextField multiline minRows={3} value={linesToText(hEn.titleLines)} onChange={(e) => setEn({ ...hEn, titleLines: textToLines(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa="துணைத் தலைப்பு (தமிழ்)" labelEn="Subtitle (Tamil)">
            <TextField value={hTa.subtitle ?? ''} onChange={(e) => setTa({ ...hTa, subtitle: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Subtitle (English)" labelEn="Subtitle (English)">
            <TextField value={hEn.subtitle ?? ''} onChange={(e) => setEn({ ...hEn, subtitle: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="விளக்கம் (தமிழ்)" labelEn="Description (Tamil)">
            <TextField multiline minRows={3} value={hTa.description ?? ''} onChange={(e) => setTa({ ...hTa, description: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Description (English)" labelEn="Description (English)">
            <TextField multiline minRows={3} value={hEn.description ?? ''} onChange={(e) => setEn({ ...hEn, description: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Join button (தமிழ்)" labelEn="Join button (Tamil)">
            <TextField value={hTa.joinBtn ?? ''} onChange={(e) => setTa({ ...hTa, joinBtn: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Join button (English)" labelEn="Join button (English)">
            <TextField value={hEn.joinBtn ?? ''} onChange={(e) => setEn({ ...hEn, joinBtn: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Demands button (தமிழ்)" labelEn="Demands button (Tamil)">
            <TextField value={hTa.demandsBtn ?? ''} onChange={(e) => setTa({ ...hTa, demandsBtn: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Demands button (English)" labelEn="Demands button (English)">
            <TextField value={hEn.demandsBtn ?? ''} onChange={(e) => setEn({ ...hEn, demandsBtn: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="மாவட்டங்கள் (comma)" labelEn="Districts (Tamil)">
            <TextField value={districtsToText(hTa.districts)} onChange={(e) => setTa({ ...hTa, districts: textToDistricts(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa="Districts (English)" labelEn="Districts (English)">
            <TextField value={districtsToText(hEn.districts)} onChange={(e) => setEn({ ...hEn, districts: textToDistricts(e.target.value) })} />
          </AdminFormField>
          <AdminFormField labelTa="நீர்மட்ட label (தமிழ்)" labelEn="Water level label (Tamil)">
            <TextField value={hTa.waterLevel ?? ''} onChange={(e) => setTa({ ...hTa, waterLevel: e.target.value })} />
          </AdminFormField>
          <AdminFormField labelTa="Water level label (English)" labelEn="Water level label (English)">
            <TextField value={hEn.waterLevel ?? ''} onChange={(e) => setEn({ ...hEn, waterLevel: e.target.value })} />
          </AdminFormField>
        </Box>

        <Typography sx={{ fontFamily: mp.fontSerif, fontSize: 16, fontWeight: 700, color: mp.greenDark, mt: 1 }}>
          Stats strip (4 items)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, p: 2, borderRadius: 2, border: `1px solid ${mp.border}`, bgcolor: mp.surfaceMuted }}>
              <TextField size="small" label={`TA value ${i + 1}`} value={statsTa[i]?.value ?? ''} onChange={(e) => updateStat('ta', i, 'value', e.target.value)} />
              <TextField size="small" label={`TA label ${i + 1}`} value={statsTa[i]?.label ?? ''} onChange={(e) => updateStat('ta', i, 'label', e.target.value)} />
              <TextField size="small" label={`EN value ${i + 1}`} value={statsEn[i]?.value ?? ''} onChange={(e) => updateStat('en', i, 'value', e.target.value)} />
              <TextField size="small" label={`EN label ${i + 1}`} value={statsEn[i]?.label ?? ''} onChange={(e) => updateStat('en', i, 'label', e.target.value)} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  const renderAbout = () => {
    const aTa = ta as Translations['about']
    const aEn = en as Translations['about']
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
        <AdminFormField labelTa="Section label (தமிழ்)" labelEn="Section label (Tamil)">
          <TextField value={aTa.sectionLabel ?? ''} onChange={(e) => setTa({ ...aTa, sectionLabel: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Section label (English)" labelEn="Section label (English)">
          <TextField value={aEn.sectionLabel ?? ''} onChange={(e) => setEn({ ...aEn, sectionLabel: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="தலைப்பு (தமிழ்)" labelEn="Title (Tamil)">
          <TextField multiline minRows={2} value={linesToText(aTa.titleLines)} onChange={(e) => setTa({ ...aTa, titleLines: textToLines(e.target.value) })} />
        </AdminFormField>
        <AdminFormField labelTa="Title (English)" labelEn="Title (English)">
          <TextField multiline minRows={2} value={linesToText(aEn.titleLines)} onChange={(e) => setEn({ ...aEn, titleLines: textToLines(e.target.value) })} />
        </AdminFormField>
        <AdminFormField labelTa="பத்தி 1" labelEn="Paragraph 1 (Tamil)">
          <TextField multiline minRows={4} value={aTa.p1 ?? ''} onChange={(e) => setTa({ ...aTa, p1: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Paragraph 1 (English)" labelEn="Paragraph 1 (English)">
          <TextField multiline minRows={4} value={aEn.p1 ?? ''} onChange={(e) => setEn({ ...aEn, p1: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="பத்தி 2" labelEn="Paragraph 2 (Tamil)">
          <TextField multiline minRows={4} value={aTa.p2 ?? ''} onChange={(e) => setTa({ ...aTa, p2: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Paragraph 2 (English)" labelEn="Paragraph 2 (English)">
          <TextField multiline minRows={4} value={aEn.p2 ?? ''} onChange={(e) => setEn({ ...aEn, p2: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Badge text (தமிழ்)" labelEn="Badge text (Tamil)">
          <TextField value={aTa.badge ?? ''} onChange={(e) => setTa({ ...aTa, badge: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Badge text (English)" labelEn="Badge text (English)">
          <TextField value={aEn.badge ?? ''} onChange={(e) => setEn({ ...aEn, badge: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Stat 1 label (தமிழ்)" labelEn="Stat 1 label (Tamil)">
          <TextField value={aTa.stat1 ?? ''} onChange={(e) => setTa({ ...aTa, stat1: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Stat 1 label (English)" labelEn="Stat 1 label (English)">
          <TextField value={aEn.stat1 ?? ''} onChange={(e) => setEn({ ...aEn, stat1: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Stat 2 label (தமிழ்)" labelEn="Stat 2 label (Tamil)">
          <TextField value={aTa.stat2 ?? ''} onChange={(e) => setTa({ ...aTa, stat2: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Stat 2 label (English)" labelEn="Stat 2 label (English)">
          <TextField value={aEn.stat2 ?? ''} onChange={(e) => setEn({ ...aEn, stat2: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Image alt (தமிழ்)" labelEn="Image alt (Tamil)">
          <TextField value={aTa.imageAlt ?? ''} onChange={(e) => setTa({ ...aTa, imageAlt: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Image alt (English)" labelEn="Image alt (English)">
          <TextField value={aEn.imageAlt ?? ''} onChange={(e) => setEn({ ...aEn, imageAlt: e.target.value })} />
        </AdminFormField>
      </Box>
    )
  }

  const renderQuote = () => {
    const qTa = ta as Translations['quote']
    const qEn = en as Translations['quote']
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
        <AdminFormField labelTa="மேற்கோள் (தமிழ்)" labelEn="Quote (Tamil)">
          <TextField multiline minRows={3} value={qTa.text ?? ''} onChange={(e) => setTa({ ...qTa, text: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Quote (English)" labelEn="Quote (English)">
          <TextField multiline minRows={3} value={qEn.text ?? ''} onChange={(e) => setEn({ ...qEn, text: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="ஆசிரியர் (தமிழ்)" labelEn="Attribution (Tamil)">
          <TextField value={qTa.attribution ?? ''} onChange={(e) => setTa({ ...qTa, attribution: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Attribution (English)" labelEn="Attribution (English)">
          <TextField value={qEn.attribution ?? ''} onChange={(e) => setEn({ ...qEn, attribution: e.target.value })} />
        </AdminFormField>
      </Box>
    )
  }

  const renderFooter = () => {
    const fTa = ta as Translations['footer']
    const fEn = en as Translations['footer']

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
        <AdminFormField labelTa="விளக்கம் (தமிழ்)" labelEn="Description (Tamil)">
          <TextField multiline minRows={3} value={fTa.description ?? ''} onChange={(e) => setTa({ ...fTa, description: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Description (English)" labelEn="Description (English)">
          <TextField multiline minRows={3} value={fEn.description ?? ''} onChange={(e) => setEn({ ...fEn, description: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="பக்கங்கள் தலைப்பு (தமிழ்)" labelEn="Pages title (Tamil)">
          <TextField value={fTa.pagesTitle ?? ''} onChange={(e) => setTa({ ...fTa, pagesTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Pages title (English)" labelEn="Pages title (English)">
          <TextField value={fEn.pagesTitle ?? ''} onChange={(e) => setEn({ ...fEn, pagesTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="மாவட்ட தலைப்பு (தமிழ்)" labelEn="Districts title (Tamil)">
          <TextField value={fTa.districtsTitle ?? ''} onChange={(e) => setTa({ ...fTa, districtsTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Districts title (English)" labelEn="Districts title (English)">
          <TextField value={fEn.districtsTitle ?? ''} onChange={(e) => setEn({ ...fEn, districtsTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="சமூக ஊடக தலைப்பு (தமிழ்)" labelEn="Social title (Tamil)">
          <TextField value={fTa.socialTitle ?? ''} onChange={(e) => setTa({ ...fTa, socialTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Social title (English)" labelEn="Social title (English)">
          <TextField value={fEn.socialTitle ?? ''} onChange={(e) => setEn({ ...fEn, socialTitle: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="மாவட்டங்கள் (comma)" labelEn="Districts list (Tamil)">
          <TextField value={districtsToText(fTa.districts)} onChange={(e) => setTa({ ...fTa, districts: textToDistricts(e.target.value) })} />
        </AdminFormField>
        <AdminFormField labelTa="Districts list (English)" labelEn="Districts list (English)">
          <TextField value={districtsToText(fEn.districts)} onChange={(e) => setEn({ ...fEn, districts: textToDistricts(e.target.value) })} />
        </AdminFormField>
        <AdminFormField labelTa="பதிப்புரிமை (தமிழ்)" labelEn="Copyright (Tamil)">
          <TextField value={fTa.copyright ?? ''} onChange={(e) => setTa({ ...fTa, copyright: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Copyright (English)" labelEn="Copyright (English)">
          <TextField value={fEn.copyright ?? ''} onChange={(e) => setEn({ ...fEn, copyright: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="குறிக்கோள் (தமிழ்)" labelEn="Tagline (Tamil)">
          <TextField value={fTa.tagline ?? ''} onChange={(e) => setTa({ ...fTa, tagline: e.target.value })} />
        </AdminFormField>
        <AdminFormField labelTa="Tagline (English)" labelEn="Tagline (English)">
          <TextField value={fEn.tagline ?? ''} onChange={(e) => setEn({ ...fEn, tagline: e.target.value })} />
        </AdminFormField>
      </Box>
    )
  }

  const renderJoin = () => {
    const jTa = ta as Translations['join']
    const jEn = en as Translations['join']
    const fields: { key: keyof Translations['join']; labelTa: string; labelEn: string; multiline?: boolean }[] = [
      { key: 'sectionLabel', labelTa: 'பிரிவு label', labelEn: 'Section label' },
      { key: 'title', labelTa: 'தலைப்பு', labelEn: 'Title' },
      { key: 'description', labelTa: 'விளக்கம்', labelEn: 'Description', multiline: true },
      { key: 'freeNote', labelTa: 'இலவச குறிப்பு', labelEn: 'Free note' },
      { key: 'nameLabel', labelTa: 'பெயர் label', labelEn: 'Name label' },
      { key: 'namePlaceholder', labelTa: 'பெயர் placeholder', labelEn: 'Name placeholder' },
      { key: 'fatherNameLabel', labelTa: 'தந்தை பெயர் label', labelEn: 'Father name label' },
      { key: 'fatherNamePlaceholder', labelTa: 'தந்தை placeholder', labelEn: 'Father placeholder' },
      { key: 'phoneLabel', labelTa: 'கைபேசி label', labelEn: 'Phone label' },
      { key: 'phonePlaceholder', labelTa: 'கைபேசி placeholder', labelEn: 'Phone placeholder' },
      { key: 'aadhaarLabel', labelTa: 'ஆதார் label', labelEn: 'Aadhaar label' },
      { key: 'aadhaarPlaceholder', labelTa: 'ஆதார் placeholder', labelEn: 'Aadhaar placeholder' },
      { key: 'villageLabel', labelTa: 'ஊர் label', labelEn: 'Village label' },
      { key: 'villagePlaceholder', labelTa: 'ஊர் placeholder', labelEn: 'Village placeholder' },
      { key: 'emailLabel', labelTa: 'மின்னஞ்சல் label', labelEn: 'Email label' },
      { key: 'emailPlaceholder', labelTa: 'மின்னஞ்சல் placeholder', labelEn: 'Email placeholder' },
      { key: 'submitBtn', labelTa: 'Submit button', labelEn: 'Submit button' },
      { key: 'thanks', labelTa: 'Thanks heading', labelEn: 'Thanks heading' },
      { key: 'thanksMsg', labelTa: 'வெற்றி செய்தி', labelEn: 'Success message', multiline: true },
      { key: 'defaultName', labelTa: 'Default name fallback', labelEn: 'Default name fallback' },
      { key: 'submitError', labelTa: 'Error message', labelEn: 'Error message' },
    ]
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
        {fields.map(({ key, labelTa, labelEn, multiline }) => (
          <Fragment key={key}>
            <AdminFormField key={`${key}-ta`} labelTa={`${labelTa} (தமிழ்)`} labelEn={`${labelTa} (Tamil)`}>
              <TextField
                multiline={multiline}
                minRows={multiline ? 2 : undefined}
                value={(jTa[key] as string) ?? ''}
                onChange={(e) => setTa({ ...jTa, [key]: e.target.value })}
              />
            </AdminFormField>
            <AdminFormField key={`${key}-en`} labelTa={`${labelEn} (English)`} labelEn={`${labelEn} (English)`}>
              <TextField
                multiline={multiline}
                minRows={multiline ? 2 : undefined}
                value={(jEn[key] as string) ?? ''}
                onChange={(e) => setEn({ ...jEn, [key]: e.target.value })}
              />
            </AdminFormField>
          </Fragment>
        ))}
      </Box>
    )
  }

  const renderSlides = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {slides.map((slide, i) => (
        <MpCard key={i} padding={2.5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 2 }}>
            <TextField select label="Type" value={slide.type} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, type: e.target.value as 'image' | 'video' } : x)))}>
              <MenuItem value="image">image</MenuItem>
              <MenuItem value="video">video</MenuItem>
            </TextField>
            <TextField label="Source URL" value={slide.src} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)))} />
            <TextField label="Alt text" value={slide.alt} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
          </Box>
          <Button size="small" color="error" sx={{ mt: 1.5 }} onClick={() => setSlides((s) => s.filter((_, j) => j !== i))}>
            Remove
          </Button>
        </MpCard>
      ))}
      <Button variant="outlined" onClick={() => setSlides((s) => [...s, { type: 'image', src: '', alt: '' }])}>
        Add slide
      </Button>
    </Box>
  )

  const renderSection = () => {
    switch (tab) {
      case 'hero':
        return renderHero()
      case 'about':
        return renderAbout()
      case 'quote':
        return renderQuote()
      case 'footer':
        return renderFooter()
      case 'join':
        return renderJoin()
      case 'slides':
        return renderSlides()
      default:
        return null
    }
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {tabs.map((t) => (
          <Tab key={t.key} value={t.key} label={t.label} sx={{ textTransform: 'none', fontWeight: 600 }} />
        ))}
      </Tabs>

      <MpCard padding={4}>
        {sectionLoading && (
          <Typography sx={{ color: mp.textMuted, mb: 2 }}>{c.loading}</Typography>
        )}
        {!sectionLoading && loadError && (
          <Typography sx={{ color: '#b91c1c', mb: 2 }}>{loadError}</Typography>
        )}
        {ready && renderSection()}
        <Button variant="contained" disabled={saving || sectionLoading || !ready} onClick={saveSection} sx={{ mt: 3 }}>
          {saving ? '…' : c.save}
        </Button>
      </MpCard>
    </Box>
  )
}
