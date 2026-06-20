import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

export function ScrollToTop() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t.scrollToTop}
      className={`fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-green-mid text-off-white shadow-[0_8px_24px_rgba(6,122,82,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-dark hover:shadow-[0_12px_28px_rgba(6,122,82,0.45)] ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  )
}
