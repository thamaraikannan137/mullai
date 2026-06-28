export type SocialPlatform = 'facebook' | 'instagram' | 'youtube'

export interface SocialLinks {
  facebook: string
  instagram: string
  youtube: string
}

const labels: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
  }

  if (platform === 'facebook') {
    return (
      <svg {...common}>
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.26h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
      </svg>
    )
  }
  if (platform === 'instagram') {
    return (
      <svg {...common}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.332.017 7.052.096 5.771.175 4.659.457 3.678 1.438c-.98.98-1.263 2.093-1.342 3.374C2.017 5.668 2 6.077 2 12c0 5.923.017 6.332.096 7.612.079 1.281.362 2.394 1.342 3.374.981.981 2.094 1.263 3.374 1.342C8.332 23.983 8.741 24 12 24s3.668-.017 4.948-.096c1.281-.079 2.394-.361 3.374-1.342.98-.98 1.263-2.093 1.342-3.374.079-1.28.096-1.689.096-7.612 0-5.923-.017-6.332-.096-7.612-.079-1.281-.362-2.394-1.342-3.374-.981-.981-2.094-1.263-3.374-1.342C15.668.017 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  )
}

interface SocialLinksRowProps {
  links: SocialLinks
  variant?: 'footer' | 'contact'
  title?: string
}

export function SocialLinksRow({ links, variant = 'footer', title }: SocialLinksRowProps) {
  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'youtube']
  const isContact = variant === 'contact'

  const baseClass = isContact
    ? 'flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/[0.06] text-gold-pale shadow-[inset_0_0_0_1px_rgba(230,177,48,0.35)] transition'
    : 'flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-[#C9DFCF] transition'

  const activeClass = isContact
    ? 'no-underline hover:bg-white/10 hover:text-off-white'
    : 'no-underline hover:border-gold/45 hover:bg-white/[0.08] hover:text-gold-pale'

  const disabledClass = 'cursor-default opacity-45'

  return (
    <div className="mt-6">
      {title && (
        <p
          className={
            isContact
              ? 'font-accent mb-3 text-[12.5px] tracking-[2px] text-[#9CC4AE] uppercase'
              : 'mb-3 font-accent text-[12.5px] tracking-[2px] text-gold uppercase'
          }
        >
          {title}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => {
          const url = links[platform]?.trim()
          if (url) {
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels[platform]}
                title={labels[platform]}
                className={`${baseClass} ${activeClass}`}
              >
                <SocialIcon platform={platform} />
              </a>
            )
          }
          return (
            <span
              key={platform}
              aria-label={`${labels[platform]} (link not set)`}
              title={`${labels[platform]} — link not set`}
              className={`${baseClass} ${disabledClass}`}
            >
              <SocialIcon platform={platform} />
            </span>
          )
        })}
      </div>
    </div>
  )
}
