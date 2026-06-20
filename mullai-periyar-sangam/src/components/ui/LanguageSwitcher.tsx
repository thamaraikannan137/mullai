import { useLanguage } from '../../i18n/LanguageContext'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, toggleLang, t } = useLanguage()
  const label = lang === 'ta' ? 'EN' : 'TA'

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`rounded-lg border border-green-dark/15 px-3 py-2 text-[13px] font-semibold text-green-mid transition hover:border-green-mid hover:bg-green-pale ${className}`}
      aria-label={`Switch to ${t.switchLang}`}
    >
      {label}
    </button>
  )
}
