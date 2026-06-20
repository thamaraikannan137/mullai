import { useState } from 'react'
import { Logo } from '../ui/Logo'
import { nav } from '../../data/content'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 z-[60] border-b border-green-dark/10 bg-off-white/85 backdrop-blur-[14px] backdrop-saturate-150">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-6 px-8">
        <a href="#home" className="flex items-center gap-3.5 text-inherit no-underline">
          <Logo />
          <span className="flex flex-col leading-tight">
            <span className="font-tamil-serif text-[17px] font-bold whitespace-nowrap text-green-dark">
              முல்லைப் பெரியாறு சங்கம்
            </span>
            <span className="mt-0.5 font-accent text-[11px] tracking-[2.5px] text-gold-dark uppercase">
              Periyar Farmers' Association
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-[14.5px] font-medium whitespace-nowrap text-[#2C3A32] no-underline transition-colors hover:bg-green-pale hover:text-green-mid"
            >
              {item.ta}
            </a>
          ))}
          <a
            href="#join"
            className="ml-3 rounded-[9px] bg-green-mid px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-off-white no-underline shadow-[0_4px_14px_rgba(6,122,82,0.22)] transition hover:-translate-y-px hover:bg-green-dark"
          >
            உறுப்பினராகுங்கள்
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-dark/15 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="மெனு"
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
      </div>

      {open && (
        <nav className="border-t border-green-dark/10 bg-off-white px-8 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#2C3A32] no-underline hover:bg-green-pale"
              >
                {item.ta}
              </a>
            ))}
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[9px] bg-green-mid px-5 py-3 text-center text-sm font-semibold text-off-white no-underline"
            >
              உறுப்பினராகுங்கள்
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
