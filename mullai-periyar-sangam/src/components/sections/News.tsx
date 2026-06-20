import { ImageSlot } from '../ui/ImageSlot'
import { SectionLabel } from '../ui/SectionLabel'
import { news } from '../../data/content'

export function News() {
  return (
    <section
      id="news"
      className="bg-[radial-gradient(130%_150%_at_82%_0%,#0A8A5C_0%,#066F47_38%,#064E3B_100%)] py-[118px] text-off-white"
    >
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel number="04" label="News & Announcements" light />
            <h2 className="font-tamil-serif text-[clamp(30px,3.8vw,46px)] font-bold">
              செய்திகள் & அறிவிப்புகள்
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <article
              key={n.ta}
              className="flex flex-col overflow-hidden rounded-[18px] border border-gold/24 bg-white/[0.035] transition hover:-translate-y-1.5 hover:border-gold/55"
            >
              <div className="relative">
                <ImageSlot src={n.img} alt={n.ta} className="h-[180px] w-full" />
                <span className="absolute top-4 left-4 rounded-md bg-gold px-3 py-1 font-accent text-[12.5px] tracking-wide text-green-dark uppercase">
                  {n.tag}
                </span>
              </div>
              <div className="flex flex-col p-7">
                <p className="text-[13px] tracking-wide text-[#A9C2B2]">{n.date}</p>
                <h3 className="mt-2.5 font-tamil-serif text-xl leading-snug font-semibold">
                  {n.ta}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#C9DFCF]">{n.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
