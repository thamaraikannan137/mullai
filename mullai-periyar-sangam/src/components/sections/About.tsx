import { ImageSlot } from '../ui/ImageSlot'
import { SectionLabel } from '../ui/SectionLabel'
import { images } from '../../data/content'
import { useLanguage } from '../../i18n/LanguageContext'

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="mx-auto max-w-[1240px] px-8 pt-[120px] pb-6">
      <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-[72px]">
        <div>
          <SectionLabel number="01" label={t.about.sectionLabel} />
          <h2 className="font-tamil-serif text-[clamp(30px,3.8vw,46px)] leading-[1.18] font-bold tracking-[-0.3px] text-green-dark">
            {t.about.titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < t.about.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.85] text-text-body">{t.about.p1}</p>
          <p className="mt-4 text-[17px] leading-[1.85] text-text-body">{t.about.p2}</p>
          <div className="mt-8 flex gap-9 border-t border-[#E1EAE3] pt-7">
            <div>
              <div className="font-accent text-[34px] leading-none font-semibold text-green-mid">5</div>
              <div className="mt-2 text-[13.5px] text-text-muted">{t.about.stat1}</div>
            </div>
            <div>
              <div className="font-accent text-[34px] leading-none font-semibold text-green-mid">
                {t.hero.stats[1].value}
              </div>
              <div className="mt-2 text-[13.5px] text-text-muted">{t.about.stat2}</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[18px] border border-[#E1EAE3] shadow-[0_30px_70px_rgba(5,70,50,0.20)]">
            <ImageSlot
              src={images.about}
              alt={t.about.imageAlt}
              className="h-[clamp(360px,40vw,500px)] w-full"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-[14px] border border-gold/35 bg-green-dark px-6 py-5 text-off-white shadow-[0_18px_40px_rgba(5,70,50,0.30)]">
            <div className="font-accent text-[38px] leading-none font-semibold text-gold-pale">1895</div>
            <div className="mt-1.5 font-tamil-serif text-[13px] text-[#CFE2D4]">{t.about.badge}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
