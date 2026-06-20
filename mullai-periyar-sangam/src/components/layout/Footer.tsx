import { Logo } from '../ui/Logo'
import { SiteName } from '../ui/SiteName'
import { useLanguage } from '../../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-footer pb-8 text-[#C9DFCF]">
      <div className="h-[3px] bg-gradient-to-r from-gold via-green-bright to-green-mid" />
      <div className="mx-auto max-w-[1240px] px-8 pt-[70px]">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[380px]">
            <div className="flex items-center gap-3.5">
              <Logo variant="footer" />
              <SiteName size="footer" lineClassName="text-off-white" />
            </div>
            <p className="mt-5 text-[14.5px] leading-[1.8] text-[#9FBBAB]">{t.footer.description}</p>
            <a
              href="#join"
              className="mt-6 inline-flex items-center gap-2 rounded-[9px] bg-gold px-5 py-3 text-sm font-semibold text-footer no-underline transition hover:-translate-y-px"
            >
              {t.joinCta} →
            </a>
          </div>

          <div>
            <h4 className="mb-5 font-accent text-[12.5px] tracking-[2px] text-gold uppercase">
              {t.footer.pagesTitle}
            </h4>
            <div className="flex flex-col gap-3">
              {t.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[14.5px] text-[#C9DFCF] no-underline transition hover:text-off-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-accent text-[12.5px] tracking-[2px] text-gold uppercase">
              {t.footer.districtsTitle}
            </h4>
            <div className="flex flex-col gap-3 text-[14.5px] text-[#9FBBAB]">
              {t.footer.districts.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-[#7E9A8B]">
          <span>{t.footer.copyright}</span>
          <span className="font-accent text-gold italic">{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
