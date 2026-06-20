import { SectionLabel } from '../ui/SectionLabel'
import { useLanguage } from '../../i18n/LanguageContext'

export function Demands() {
  const { t } = useLanguage()

  return (
    <section id="demands" className="bg-green-pale py-[118px]">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-[72px]">
          <div className="lg:sticky lg:top-[108px]">
            <SectionLabel number="03" label={t.demands.sectionLabel} />
            <h2 className="font-tamil-serif text-[clamp(30px,3.8vw,46px)] leading-[1.18] font-bold text-green-dark">
              {t.demands.title}
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.85] text-text-body">{t.demands.intro}</p>
          </div>

          <div className="flex flex-col gap-4">
            {t.demands.items.map((d) => (
              <div
                key={d.num}
                className="flex gap-6 rounded-[14px] border border-[#E4EDE7] bg-white px-7 py-7 shadow-[0_8px_24px_rgba(5,70,50,0.04)] transition hover:translate-x-1 hover:shadow-[0_14px_32px_rgba(5,70,50,0.09)]"
              >
                <span className="min-w-[46px] shrink-0 font-accent text-[38px] leading-none font-semibold text-gold">
                  {d.num}
                </span>
                <div>
                  <p className="font-tamil-serif text-[18.5px] leading-normal font-semibold text-[#16261E]">
                    {d.text}
                  </p>
                  {d.sub && (
                    <p className="mt-2 font-accent text-[14.5px] text-[#7C8A81] italic">{d.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
