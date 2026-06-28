import { HeroCarousel } from '../ui/HeroCarousel'
import { WaterGauge } from '../ui/WaterGauge'
import { useLanguage } from '../../i18n/LanguageContext'

export function Hero() {
  const { t, heroSlides } = useLanguage()

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden text-off-white"
    >
      <HeroCarousel slides={heroSlides} />
      <div
        className="absolute inset-0 z-[1] opacity-[0.66] mix-blend-multiply"
        style={{ background: 'linear-gradient(125deg, #0E9F6E 0%, #043528 92%)' }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(102deg, rgba(4,58,42,0.90) 0%, rgba(4,58,42,0.68) 36%, rgba(4,58,42,0.30) 70%, rgba(4,58,42,0.16) 100%)',
        }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(4,46,33,0.88)] to-transparent" />
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_220px_40px_rgba(3,32,22,0.55)]" />

      <WaterGauge />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-8 pt-[150px]">
        <div className="animate-mp-rise">
          <div className="mb-[30px] inline-flex items-center gap-[13px] rounded-full border border-[rgba(201,162,74,0.55)] bg-[rgba(4,58,42,0.25)] px-[18px] py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="font-accent text-[13px] tracking-[3px] text-gold-pale uppercase">
              {t.hero.districts.join(' · ')}
            </span>
          </div>
        </div>

        <h1 className="animate-mp-rise font-tamil-serif text-[clamp(36px,5.6vw,74px)] leading-[1.1] font-bold tracking-[-0.5px] [text-shadow:0_2px_30px_rgba(0,0,0,0.25)] [animation-delay:0.1s]">
          {t.hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="animate-mp-rise mt-6 font-accent text-[clamp(19px,2.1vw,26px)] tracking-[0.3px] text-[#CFE2D4] italic [animation-delay:0.2s]">
          {t.hero.subtitle}
        </p>
        <p className="animate-mp-rise mt-[26px] max-w-[56ch] text-[clamp(16px,1.45vw,19px)] leading-[1.75] text-[#DCEAE0] [animation-delay:0.3s]">
          {t.hero.description}
        </p>
        <div className="animate-mp-rise mt-10 flex flex-wrap gap-[15px] [animation-delay:0.4s]">
          <a
            href="#join"
            className="rounded-[10px] bg-gold px-[30px] py-4 text-[15px] font-semibold text-green-dark no-underline shadow-[0_10px_28px_rgba(201,162,74,0.34)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(201,162,74,0.46)]"
          >
            {t.hero.joinBtn}
          </a>
          <a
            href="#demands"
            className="rounded-[10px] border border-white/34 bg-white/[0.06] px-[30px] py-4 text-[15px] font-semibold text-off-white no-underline transition hover:border-white/60 hover:bg-white/[0.13]"
          >
            {t.hero.demandsBtn}
          </a>
        </div>
      </div>

      <div className="relative z-[2] mx-auto mt-[54px] w-full max-w-[1240px] px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/28 bg-[rgba(4,58,42,0.42)] backdrop-blur-[10px] lg:grid-cols-4">
          {t.hero.stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-7 py-[26px] ${i > 0 ? 'border-l border-white/10' : ''}`}
            >
              <div className="font-accent text-[clamp(30px,3vw,44px)] leading-none font-semibold text-gold-pale">
                {s.value}
              </div>
              <div className="mt-2.5 font-tamil-serif text-sm leading-snug text-[#DCEAE0]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-[2] h-[54px]" />
    </section>
  )
}
