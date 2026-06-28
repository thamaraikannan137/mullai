import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { AdminModal, ModalField } from '../components/AdminModal'
import { useToast } from '../context/ToastContext'
import { api, type NewsPost } from '../lib/api'
import { youtubeThumbnailUrl } from '../../lib/newsMedia'
import { useAdminT } from '../i18n/ui'

const emptyForm = {
  tag_ta: '',
  tag_en: '',
  published_at: new Date().toISOString().slice(0, 10),
  title_ta: '',
  title_en: '',
  body_ta: '',
  body_en: '',
  image_url: '',
  media_type: 'image' as NewsPost['media_type'],
  is_published: 1,
  sort_order: 0,
}

function NewsCardMedia({ post, lang }: { post: NewsPost; lang: 'ta' | 'en' }) {
  const tag = (
    <span className="font-accent absolute bottom-3.5 left-3.5 z-10 rounded-md bg-gold px-3 py-1 text-xs uppercase tracking-wide text-green-dark">
      {lang === 'ta' ? post.tag_ta : post.tag_en}
    </span>
  )

  if (post.media_type === 'youtube' && post.image_url) {
    const thumb = youtubeThumbnailUrl(post.image_url)
    return (
      <div className="relative h-[120px] overflow-hidden bg-[#0a0a0a]">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover opacity-90" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(120%_150%_at_80%_0%,#0A8A5C,#064E3B)]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        {tag}
      </div>
    )
  }

  if (post.image_url) {
    return (
      <div className="relative h-[120px] overflow-hidden">
        <img src={post.image_url} alt="" className="h-full w-full object-cover" />
        {tag}
      </div>
    )
  }

  return (
    <div className="relative flex h-[120px] items-end bg-[radial-gradient(120%_150%_at_80%_0%,#0A8A5C,#064E3B)] p-3.5">
      <svg
        viewBox="0 0 100 100"
        width="120"
        height="120"
        className="pointer-events-none absolute -right-[26px] -top-[26px] opacity-10"
        aria-hidden
      >
        <path d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z" fill="#FBFCFA" />
      </svg>
      {tag}
    </div>
  )
}

export function NewsPage() {
  const { c, news: nt, lang } = useAdminT()
  const [rows, setRows] = useState<NewsPost[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const load = () => api.listNews().then(setRows)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (params.get('new') === '1') {
      openAdd()
      setParams({})
    }
  }, [params, setParams])

  const openAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (n: NewsPost) => {
    setEditId(n.id)
    setForm({
      ...n,
      media_type: n.media_type ?? 'image',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    navigate('/admin/news')
  }

  const save = async () => {
    if (editId) {
      await api.updateNews(editId, form)
      showToast(nt.newsUpdated)
    } else {
      await api.createNews(form)
      showToast(nt.newsAdded)
    }
    closeModal()
    load()
  }

  const remove = async (id: string) => {
    if (!confirm(c.confirmDeleteNews)) return
    await api.deleteNews(id)
    showToast(c.deleted)
    load()
  }

  const setMediaType = (media_type: NewsPost['media_type']) => {
    setForm((f) => ({ ...f, media_type }))
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
        {rows.map((post) => (
          <article
            key={post.id}
            className="flex flex-col overflow-hidden rounded-[18px] border border-[#E4EDE7] bg-white shadow-[0_10px_30px_rgba(5,70,50,0.05)]"
          >
            <NewsCardMedia post={post} lang={lang} />
            <div className="flex flex-1 flex-col p-[20px_22px_22px]">
              <p className="font-accent text-[12.5px] text-[#9AA89F]">{post.published_at}</p>
              <h3 className="font-tamil-serif mt-2 text-[17px] font-semibold leading-snug text-[#16261E]">
                {lang === 'ta' ? post.title_ta : post.title_en}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#5A6B61] line-clamp-3">
                {lang === 'ta' ? post.body_ta : post.body_en}
              </p>
              <p className="mt-2 text-[11.5px] font-semibold text-[#9AA89F]">
                {post.media_type === 'youtube' ? `▶ ${nt.youtube}` : `🖼 ${nt.image}`}
              </p>
              <div className="mt-[18px] flex gap-2 border-t border-[#EEF3EF] pt-4">
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#E4EDE7] bg-white py-2 text-[13px] font-semibold text-[#3C4A42] hover:border-green-mid hover:text-green-mid"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  {c.edit}
                </button>
                <button
                  type="button"
                  onClick={() => remove(post.id)}
                  className="flex w-10 items-center justify-center rounded-[9px] border border-[#E4EDE7] text-[#5A6B61] hover:border-red-300 hover:bg-[#FBEEEC] hover:text-red-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        size="wide"
        titleTa={editId ? nt.editNews : nt.addNews}
        titleEn={editId ? nt.editNews : nt.addNews}
        saveLabel={editId ? c.save : c.add}
        onClose={closeModal}
        onSave={save}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <ModalField labelTa={nt.tag} labelEn={nt.tag}>
            <TextField value={form.tag_ta} onChange={(e) => setForm({ ...form, tag_ta: e.target.value })} />
          </ModalField>
          <ModalField labelTa={nt.tagEn} labelEn={nt.tagEn}>
            <TextField value={form.tag_en} onChange={(e) => setForm({ ...form, tag_en: e.target.value })} />
          </ModalField>
        </Box>

        <ModalField labelTa={c.date} labelEn={c.date}>
          <TextField type="date" sx={{ maxWidth: 280 }} value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
        </ModalField>

        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <ModalField labelTa={nt.title} labelEn={nt.title}>
            <TextField multiline minRows={3} value={form.title_ta} onChange={(e) => setForm({ ...form, title_ta: e.target.value })} />
          </ModalField>
          <ModalField labelTa={nt.titleEn} labelEn={nt.titleEn}>
            <TextField multiline minRows={3} value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          </ModalField>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <ModalField labelTa={nt.body} labelEn={nt.body}>
            <TextField multiline minRows={5} value={form.body_ta} onChange={(e) => setForm({ ...form, body_ta: e.target.value })} />
          </ModalField>
          <ModalField labelTa={nt.bodyEn} labelEn={nt.bodyEn}>
            <TextField multiline minRows={5} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} />
          </ModalField>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2.25 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {nt.mediaType}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant={form.media_type === 'image' ? 'contained' : 'outlined'}
                color={form.media_type === 'image' ? 'primary' : 'inherit'}
                onClick={() => setMediaType('image')}
              >
                🖼 {nt.image}
              </Button>
              <Button
                fullWidth
                variant={form.media_type === 'youtube' ? 'contained' : 'outlined'}
                color={form.media_type === 'youtube' ? 'primary' : 'inherit'}
                onClick={() => setMediaType('youtube')}
              >
                ▶ {nt.youtube}
              </Button>
            </Box>

            <ModalField
              labelTa={form.media_type === 'youtube' ? nt.youtubeUrl : nt.imageUrl}
              labelEn={form.media_type === 'youtube' ? nt.youtubeUrl : nt.imageUrl}
            >
              <TextField
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder={
                  form.media_type === 'youtube'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://example.com/image.jpg'
                }
              />
            </ModalField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })}
                />
              }
              label={c.published}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {c.preview}
            </Typography>
            {form.image_url && form.media_type === 'youtube' && youtubeThumbnailUrl(form.image_url) ? (
              <div className="overflow-hidden rounded-[10px] border border-[#E4EDE7]">
                <img
                  src={youtubeThumbnailUrl(form.image_url)!}
                  alt="YouTube preview"
                  className="aspect-video w-full object-cover"
                />
              </div>
            ) : form.image_url && form.media_type === 'image' ? (
              <div className="overflow-hidden rounded-[10px] border border-[#E4EDE7]">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="aspect-video w-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-[10px] border border-dashed border-[#D5E0D8] bg-[#F8FAF8] text-[13px] text-[#9AA89F]">
                {form.media_type === 'youtube' ? nt.youtubePreview : nt.imagePreview}
              </div>
            )}
          </Box>
        </Box>
      </AdminModal>
    </>
  )
}
