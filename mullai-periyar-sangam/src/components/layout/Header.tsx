import { useState } from 'react'
import { Logo } from '../ui/Logo'
import { SiteName } from '../ui/SiteName'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { useLanguage } from '../../i18n/LanguageContext'

export function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 right-0 left-0 z-[60] border-b border-green-dark/10 bg-off-white/85 backdrop-blur-[14px] backdrop-saturate-150">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-4 px-8">
        <a href="/#home" className="flex min-w-0 items-center gap-3.5 text-inherit no-underline">
          <Logo />
          <SiteName lineClassName="text-green-dark" />
        </a>

        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-0.5">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={`/${item.href}`}
                className="rounded-lg px-3.5 py-2 text-[14.5px] font-medium whitespace-nowrap text-[#2C3A32] no-underline transition-colors hover:bg-green-pale hover:text-green-mid"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="/#join"
            className="ml-2 rounded-[9px] bg-green-mid px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-off-white no-underline shadow-[0_4px_14px_rgba(6,122,82,0.22)] transition hover:-translate-y-px hover:bg-green-dark"
          >
            {t.joinCta}
          </a>
          <LanguageSwitcher className="ml-2" />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-dark/15"
            onClick={() => setOpen(!open)}
            aria-label={t.menu}
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#064E3B" strokeWidth="2">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {open && (
        <nav className="border-t border-green-dark/10 bg-off-white px-8 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={`/${item.href}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#2C3A32] no-underline hover:bg-green-pale"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#join"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[9px] bg-green-mid px-5 py-3 text-center text-sm font-semibold text-off-white no-underline"
            >
              {t.joinCta}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
