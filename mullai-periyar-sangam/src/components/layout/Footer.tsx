import { Logo } from '../ui/Logo'
import { SiteName } from '../ui/SiteName'
import { SocialLinksRow } from '../ui/SocialLinks'
import { useLanguage } from '../../i18n/LanguageContext'

export function Footer() {
  const { t, siteMeta } = useLanguage()

  return (
    <footer className="overflow-x-hidden bg-footer pb-8 text-[#C9DFCF]">
      <div className="h-[3px] bg-gradient-to-r from-gold via-green-bright to-green-mid" />
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-12 sm:px-6 sm:pt-[70px] lg:px-8">
        <div className="grid min-w-0 gap-10 sm:gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="min-w-0 max-w-full md:max-w-[380px]">
            <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
              <Logo variant="footer" />
              <SiteName size="footer" lineClassName="text-off-white" className="min-w-0" />
            </div>
            <p className="mt-5 break-words text-[14.5px] leading-[1.8] text-[#9FBBAB]">{t.footer.description}</p>
            <a
              href="/#join"
              className="mt-6 inline-flex max-w-full items-center gap-2 rounded-[9px] bg-gold px-5 py-3 text-sm font-semibold text-footer no-underline transition hover:-translate-y-px"
            >
              {t.joinCta} →
            </a>
            <SocialLinksRow links={siteMeta.social} title={t.footer.socialTitle} />
          </div>

          <div className="min-w-0">
            <h4 className="mb-5 font-accent text-[12.5px] tracking-[2px] text-gold uppercase">
              {t.footer.pagesTitle}
            </h4>
            <div className="flex flex-col gap-3">
              {t.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href.startsWith('#') ? `/${item.href}` : item.href}
                  className="break-words text-[14.5px] text-[#C9DFCF] no-underline transition hover:text-off-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="mb-5 font-accent text-[12.5px] tracking-[2px] text-gold uppercase">
              {t.footer.districtsTitle}
            </h4>
            <div className="flex flex-col gap-3 text-[14.5px] text-[#9FBBAB]">
              {t.footer.districts.map((d) => (
                <span key={d} className="break-words">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-[#7E9A8B] sm:mt-14 sm:flex-row sm:flex-wrap sm:justify-between">
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{t.footer.copyright}</span>
          <span className="shrink-0 font-accent text-gold italic">{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
