import { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { AdminFormField } from '../components/AdminFormField'
import { useToast } from '../context/ToastContext'
import { api, type SiteMeta, type SiteImages } from '../lib/api'
import { useAdminT } from '../i18n/ui'
import { MpCard } from '../../ui'

function linesToText(lines: string[]) {
  return lines.join('\n')
}

function textToLines(text: string) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean)
}

export function SettingsPage() {
  const { c, settings: s } = useAdminT()
  const { showToast, showError } = useToast()

  const [contactTa, setContactTa] = useState({ sectionLabel: '', title: '', description: '', phone: '', email: '', address: '', hours: '' })
  const [contactEn, setContactEn] = useState({ sectionLabel: '', title: '', description: '', phone: '', email: '', address: '', hours: '' })
  const [orgTa, setOrgTa] = useState({ siteNameLines: '', description: '', tagline: '', copyright: '' })
  const [orgEn, setOrgEn] = useState({ siteNameLines: '', description: '', tagline: '', copyright: '' })
  const [seo, setSeo] = useState<SiteMeta['seo']>({ titleTa: '', titleEn: '', descriptionTa: '', descriptionEn: '' })
  const [aboutMeta, setAboutMeta] = useState({ districtCount: 5, badgeYear: 1895 })
  const [social, setSocial] = useState({ facebook: '', instagram: '', youtube: '' })
  const [images, setImages] = useState<SiteImages>({ about: '', join: '', presidentPhoto: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([api.getContact(), api.getOrg(), api.getSiteMeta(), api.getImages()])
      .then(([contact, org, meta, imgs]) => {
        const pick = (items: typeof contact.ta.items, icon: string) =>
          items.find((i) => i.icon === icon)?.value ?? ''
        setContactTa({
          sectionLabel: contact.ta.sectionLabel,
          title: contact.ta.title,
          description: contact.ta.description,
          phone: pick(contact.ta.items, 'phone'),
          email: pick(contact.ta.items, 'email'),
          address: pick(contact.ta.items, 'location'),
          hours: contact.ta.hours,
        })
        setContactEn({
          sectionLabel: contact.en.sectionLabel,
          title: contact.en.title,
          description: contact.en.description,
          phone: pick(contact.en.items, 'phone'),
          email: pick(contact.en.items, 'email'),
          address: pick(contact.en.items, 'location'),
          hours: contact.en.hours,
        })
        setOrgTa({
          siteNameLines: linesToText(org.ta.siteNameLines),
          description: org.ta.description,
          tagline: org.ta.tagline,
          copyright: org.ta.copyright,
        })
        setOrgEn({
          siteNameLines: linesToText(org.en.siteNameLines),
          description: org.en.description,
          tagline: org.en.tagline,
          copyright: org.en.copyright,
        })
        setSeo(meta.seo)
        setAboutMeta(meta.about)
        setSocial(meta.social)
        setImages(imgs)
      })
      .catch((e) => showError(e.message))
  }, [showError])

  const save = async () => {
    setSaving(true)
    try {
      const { ta, en } = await api.getContact()
      const updateItems = (items: typeof ta.items, p: string, e: string, a: string) =>
        items.map((item) => {
          if (item.icon === 'phone') return { ...item, value: p }
          if (item.icon === 'email') return { ...item, value: e }
          if (item.icon === 'location') return { ...item, value: a }
          return item
        })
      await api.updateContact({
        ta: {
          ...ta,
          sectionLabel: contactTa.sectionLabel,
          title: contactTa.title,
          description: contactTa.description,
          hours: contactTa.hours,
          items: updateItems(ta.items, contactTa.phone, contactTa.email, contactTa.address),
        },
        en: {
          ...en,
          sectionLabel: contactEn.sectionLabel,
          title: contactEn.title,
          description: contactEn.description,
          hours: contactEn.hours,
          items: updateItems(en.items, contactEn.phone, contactEn.email, contactEn.address),
        },
      })
      await api.updateOrg({
        ta: {
          siteNameLines: textToLines(orgTa.siteNameLines),
          description: orgTa.description,
          tagline: orgTa.tagline,
          copyright: orgTa.copyright,
        },
        en: {
          siteNameLines: textToLines(orgEn.siteNameLines),
          description: orgEn.description,
          tagline: orgEn.tagline,
          copyright: orgEn.copyright,
        },
      })
      await api.updateSiteMeta({ seo, about: aboutMeta, social })
      await api.updateImages(images)
      showToast(c.saved)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 1100 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1fr 1fr' }, gap: 3 }}>
        <MpCard padding={4}>
          <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>{s.contactTitle} (தமிழ்)</Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <AdminFormField labelTa="பிரிவு label" labelEn="Section label"><TextField value={contactTa.sectionLabel} onChange={(e) => setContactTa((v) => ({ ...v, sectionLabel: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="தலைப்பு" labelEn="Title"><TextField value={contactTa.title} onChange={(e) => setContactTa((v) => ({ ...v, title: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="விளக்கம்" labelEn="Description"><TextField multiline minRows={2} value={contactTa.description} onChange={(e) => setContactTa((v) => ({ ...v, description: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="கைபேசி" labelEn="Phone"><TextField value={contactTa.phone} onChange={(e) => setContactTa((v) => ({ ...v, phone: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="மின்னஞ்சல்" labelEn="Email"><TextField value={contactTa.email} onChange={(e) => setContactTa((v) => ({ ...v, email: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="முகவரி" labelEn="Address"><TextField multiline minRows={2} value={contactTa.address} onChange={(e) => setContactTa((v) => ({ ...v, address: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="அலுவலக நேரம்" labelEn="Office hours"><TextField value={contactTa.hours} onChange={(e) => setContactTa((v) => ({ ...v, hours: e.target.value }))} /></AdminFormField>
          </Box>
        </MpCard>

        <MpCard padding={4}>
          <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>{s.contactTitle} (English)</Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <AdminFormField labelTa="Section label" labelEn="Section label"><TextField value={contactEn.sectionLabel} onChange={(e) => setContactEn((v) => ({ ...v, sectionLabel: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Title" labelEn="Title"><TextField value={contactEn.title} onChange={(e) => setContactEn((v) => ({ ...v, title: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Description" labelEn="Description"><TextField multiline minRows={2} value={contactEn.description} onChange={(e) => setContactEn((v) => ({ ...v, description: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Phone" labelEn="Phone"><TextField value={contactEn.phone} onChange={(e) => setContactEn((v) => ({ ...v, phone: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Email" labelEn="Email"><TextField value={contactEn.email} onChange={(e) => setContactEn((v) => ({ ...v, email: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Address" labelEn="Address"><TextField multiline minRows={2} value={contactEn.address} onChange={(e) => setContactEn((v) => ({ ...v, address: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Office hours" labelEn="Office hours"><TextField value={contactEn.hours} onChange={(e) => setContactEn((v) => ({ ...v, hours: e.target.value }))} /></AdminFormField>
          </Box>
        </MpCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '1fr 1fr' }, gap: 3 }}>
        <MpCard padding={4}>
          <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>{s.orgTitle} (தமிழ்)</Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <AdminFormField labelTa="சங்கப் பெயர் (வரி ஒன்று ஒரு வரி)" labelEn="Org name lines"><TextField multiline minRows={3} value={orgTa.siteNameLines} onChange={(e) => setOrgTa((v) => ({ ...v, siteNameLines: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="விளக்கம்" labelEn="Description"><TextField multiline minRows={3} value={orgTa.description} onChange={(e) => setOrgTa((v) => ({ ...v, description: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="குறிக்கோள்" labelEn="Tagline"><TextField value={orgTa.tagline} onChange={(e) => setOrgTa((v) => ({ ...v, tagline: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="பதிப்புரிமை" labelEn="Copyright"><TextField value={orgTa.copyright} onChange={(e) => setOrgTa((v) => ({ ...v, copyright: e.target.value }))} /></AdminFormField>
          </Box>
        </MpCard>

        <MpCard padding={4}>
          <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>{s.orgTitle} (English)</Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <AdminFormField labelTa="Org name lines" labelEn="Org name lines"><TextField multiline minRows={3} value={orgEn.siteNameLines} onChange={(e) => setOrgEn((v) => ({ ...v, siteNameLines: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Description" labelEn="Description"><TextField multiline minRows={3} value={orgEn.description} onChange={(e) => setOrgEn((v) => ({ ...v, description: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Tagline" labelEn="Tagline"><TextField value={orgEn.tagline} onChange={(e) => setOrgEn((v) => ({ ...v, tagline: e.target.value }))} /></AdminFormField>
            <AdminFormField labelTa="Copyright" labelEn="Copyright"><TextField value={orgEn.copyright} onChange={(e) => setOrgEn((v) => ({ ...v, copyright: e.target.value }))} /></AdminFormField>
          </Box>
        </MpCard>
      </Box>

      <MpCard padding={4}>
        <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>SEO & About stats</Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <AdminFormField labelTa="பக்க தலைப்பு (தமிழ்)" labelEn="Page title (Tamil)"><TextField value={seo.titleTa} onChange={(e) => setSeo((v) => ({ ...v, titleTa: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="Page title (English)" labelEn="Page title (English)"><TextField value={seo.titleEn} onChange={(e) => setSeo((v) => ({ ...v, titleEn: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="Meta description (Tamil)" labelEn="Meta description (Tamil)"><TextField multiline minRows={2} value={seo.descriptionTa} onChange={(e) => setSeo((v) => ({ ...v, descriptionTa: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="Meta description (English)" labelEn="Meta description (English)"><TextField multiline minRows={2} value={seo.descriptionEn} onChange={(e) => setSeo((v) => ({ ...v, descriptionEn: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="மாவட்ட எண்ணிக்கை" labelEn="District count"><TextField type="number" value={aboutMeta.districtCount} onChange={(e) => setAboutMeta((v) => ({ ...v, districtCount: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField labelTa="அணை ஆண்டு" labelEn="Dam year badge"><TextField type="number" value={aboutMeta.badgeYear} onChange={(e) => setAboutMeta((v) => ({ ...v, badgeYear: Number(e.target.value) }))} /></AdminFormField>
        </Box>
      </MpCard>

      <MpCard padding={4}>
        <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>Social media links</Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 2.25 }}>
          <AdminFormField labelTa="Facebook" labelEn="Facebook">
            <TextField placeholder="https://facebook.com/..." value={social.facebook} onChange={(e) => setSocial((v) => ({ ...v, facebook: e.target.value }))} />
          </AdminFormField>
          <AdminFormField labelTa="Instagram" labelEn="Instagram">
            <TextField placeholder="https://instagram.com/..." value={social.instagram} onChange={(e) => setSocial((v) => ({ ...v, instagram: e.target.value }))} />
          </AdminFormField>
          <AdminFormField labelTa="YouTube" labelEn="YouTube">
            <TextField placeholder="https://youtube.com/..." value={social.youtube} onChange={(e) => setSocial((v) => ({ ...v, youtube: e.target.value }))} />
          </AdminFormField>
        </Box>
      </MpCard>

      <MpCard padding={4}>
        <Typography sx={{ fontFamily: '"Noto Serif Tamil", serif', fontSize: 19, fontWeight: 700, color: '#064e3b' }}>Media URLs</Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <AdminFormField labelTa="About image URL" labelEn="About image URL"><TextField value={images.about} onChange={(e) => setImages((v) => ({ ...v, about: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="Join section image URL" labelEn="Join image URL"><TextField value={images.join} onChange={(e) => setImages((v) => ({ ...v, join: e.target.value }))} /></AdminFormField>
          <AdminFormField labelTa="President photo URL" labelEn="President photo URL"><TextField value={images.presidentPhoto} onChange={(e) => setImages((v) => ({ ...v, presidentPhoto: e.target.value }))} /></AdminFormField>
        </Box>
      </MpCard>

      <Button variant="contained" disabled={saving} onClick={save} sx={{ alignSelf: 'flex-start', px: 4 }}>
        {saving ? '…' : c.save}
      </Button>
    </Box>
  )
}
