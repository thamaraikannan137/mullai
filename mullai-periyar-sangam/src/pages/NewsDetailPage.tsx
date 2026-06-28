import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PublicLayout } from '../components/layout/PublicLayout'
import { NewsMedia } from '../components/ui/NewsMedia'
import { useLanguage } from '../i18n/LanguageContext'
import { fetchPublicNews, setPageMeta, type PublicNewsPost } from '../lib/public-api'

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lang } = useLanguage()
  const [post, setPost] = useState<PublicNewsPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setNotFound(false)

    fetchPublicNews(id)
      .then((data) => {
        if (!cancelled) setPost(data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const title = post ? (lang === 'ta' ? post.title_ta : post.title_en) : ''
  const tag = post ? (lang === 'ta' ? post.tag_ta : post.tag_en) : ''
  const body = post ? (lang === 'ta' ? post.body_ta : post.body_en) : ''

  useEffect(() => {
    if (!title) {
      setPageMeta({ title: 'Mullai Periyar Sangam' })
      return
    }
    const desc = body.replace(/\s+/g, ' ').trim().slice(0, 160)
    setPageMeta({
      title: `${title} · Mullai Periyar Sangam`,
      description: desc,
    })
  }, [title, body])

  return (
    <PublicLayout>
      <article className="mx-auto max-w-[860px] px-8 pt-28 pb-24">
        <Link
          to="/#news"
          className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-green-mid no-underline transition hover:text-green-dark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {lang === 'ta' ? 'அனைத்து செய்திகள்' : 'All news'}
        </Link>

        {loading ? (
          <p className="mt-16 text-center text-[#7C8A81]">
            {lang === 'ta' ? 'ஏற்றுகிறது…' : 'Loading…'}
          </p>
        ) : notFound || !post ? (
          <div className="mt-16 rounded-[18px] border border-[#E4EDE7] bg-white px-8 py-16 text-center shadow-[0_10px_30px_rgba(5,70,50,0.05)]">
            <p className="font-tamil-serif text-2xl font-bold text-green-dark">
              {lang === 'ta' ? 'செய்தி கிடைக்கவில்லை' : 'News not found'}
            </p>
            <p className="mt-2 text-[#7C8A81]">
              {lang === 'ta'
                ? 'இந்த செய்தி நீக்கப்பட்டிருக்கலாம் அல்லது வெளியிடப்படவில்லை.'
                : 'This post may have been removed or is not published.'}
            </p>
            <Link
              to="/#news"
              className="mt-6 inline-block rounded-[10px] bg-green-mid px-6 py-3 text-sm font-semibold text-off-white no-underline hover:bg-green-dark"
            >
              {lang === 'ta' ? 'செய்திகளுக்கு திரும்பு' : 'Back to news'}
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-gold px-3 py-1 font-accent text-[12.5px] tracking-wide text-green-dark uppercase">
                {tag}
              </span>
              <time className="font-accent text-[14px] text-[#7C8A81]">{post.published_at}</time>
            </div>

            <h1 className="font-tamil-serif mt-5 text-[clamp(28px,4vw,42px)] font-bold leading-snug text-green-dark">
              {title}
            </h1>

            <div className="mt-8 overflow-hidden rounded-[18px] border border-[#E4EDE7] shadow-[0_10px_30px_rgba(5,70,50,0.06)]">
              <NewsMedia
                mediaType={post.media_type ?? 'image'}
                src={post.image_url}
                title={title}
                className="aspect-video w-full md:aspect-[16/9]"
              />
            </div>

            <div className="prose-custom mt-8 text-[17px] leading-[1.85] text-[#3C4A42] whitespace-pre-wrap">
              {body}
            </div>
          </div>
        )}
      </article>
    </PublicLayout>
  )
}
