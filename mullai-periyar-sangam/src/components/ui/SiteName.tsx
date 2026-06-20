import { useLanguage } from '../../i18n/LanguageContext'

export function SiteName({
  className = '',
  lineClassName = '',
  size = 'header',
}: {
  className?: string
  lineClassName?: string
  size?: 'header' | 'footer'
}) {
  const { t } = useLanguage()

  if (size === 'header') {
    return (
      <span className={`flex flex-col leading-[1.08] ${className}`}>
        {t.siteNameLines.map((line) => (
          <span
            key={line}
            className={`whitespace-nowrap font-tamil-serif text-[13px] font-bold sm:text-[14px] ${lineClassName}`}
          >
            {line}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className={`flex min-w-0 flex-col leading-[1.15] ${className}`}>
      {t.siteNameLines.map((line, i) => (
        <span
          key={line}
          className={`break-words font-tamil-serif font-bold ${i === 0 ? 'text-base' : 'text-sm'} ${lineClassName}`}
        >
          {line}
        </span>
      ))}
    </span>
  )
}
