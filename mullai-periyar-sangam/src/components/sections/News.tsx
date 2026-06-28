import { Link } from 'react-router-dom'
import { NewsMedia } from '../ui/NewsMedia'
import { SectionLabel } from '../ui/SectionLabel'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Lang } from '../../i18n/translations'

function NewsCard({
  id,
  tag,
  date,
  title,
  body,
  img,
  mediaType,
  lang,
}: {
  id?: string
  tag: string
  date: string
  title: string
  body: string
  img: string
  mediaType?: 'image' | 'youtube'
  lang: Lang
}) {
  const inner = (
    <>
      <div className="relative">
        <NewsMedia
          mediaType={mediaType ?? 'image'}
          src={img}
          title={title}
          className="h-[180px] w-full"
        />
        <span className="absolute top-4 left-4 rounded-md bg-gold px-3 py-1 font-accent text-[12.5px] tracking-wide text-green-dark uppercase">
          {tag}
        </span>
      </div>
      <div className="flex flex-col p-7">
        <p className="text-[13px] tracking-wide text-[#A9C2B2]">{date}</p>
        <h3 className="mt-2.5 font-tamil-serif text-xl leading-snug font-semibold">{title}</h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-[1.7] text-[#C9DFCF]">{body}</p>
        {id && (
          <p className="mt-4 text-[13px] font-semibold text-gold">
            {lang === 'ta' ? 'மேலும் படிக்க →' : 'Read more →'}
          </p>
        )}
      </div>
    </>
  )

  if (!id) {
    return (
      <article className="flex flex-col overflow-hidden rounded-[18px] border border-gold/24 bg-white/[0.035]">
        {inner}
      </article>
    )
  }

  return (
    <Link
      to={`/news/${id}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-gold/24 bg-white/[0.035] text-inherit no-underline transition hover:-translate-y-1.5 hover:border-gold/55"
    >
      {inner}
    </Link>
  )
}

export function News() {
  const { t, lang } = useLanguage()

  return (
    <section
      id="news"
      className="bg-[radial-gradient(130%_150%_at_82%_0%,#0A8A5C_0%,#066F47_38%,#064E3B_100%)] py-[118px] text-off-white"
    >
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel number="04" label={t.news.sectionLabel} light />
            <h2 className="font-tamil-serif text-[clamp(30px,3.8vw,46px)] font-bold">{t.news.title}</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.news.items.map((n, index) => (
            <NewsCard
              key={n.id ?? `${n.title}-${index}`}
              id={n.id}
              tag={n.tag}
              date={n.date}
              title={n.title}
              body={n.body}
              img={n.img}
              mediaType={n.mediaType}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
