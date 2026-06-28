import { SectionLabel } from '../ui/SectionLabel'
import { SocialLinksRow } from '../ui/SocialLinks'
import { useLanguage } from '../../i18n/LanguageContext'
import type { ContactItem } from '../../i18n/translations'

function ContactIcon({ type }: { type: 'phone' | 'email' | 'location' }) {
  const paths = {
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    ),
    email: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  }

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F3E3B3"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]}
    </svg>
  )
}

function contactHref(icon: ContactItem['icon'], value: string): string | undefined {
  if (icon === 'phone') {
    const digits = value.replace(/\D/g, '')
    if (!digits) return undefined
    return digits.length === 10 ? `tel:+91${digits}` : `tel:+${digits}`
  }
  if (icon === 'email' && value.includes('@')) return `mailto:${value.trim()}`
  return undefined
}

export function Contact() {
  const { t, siteMeta } = useLanguage()

  return (
    <section id="contact" className="overflow-x-hidden bg-green-pale py-16 md:py-24 lg:py-[118px]">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-full overflow-hidden rounded-[20px] sm:rounded-[26px] bg-[radial-gradient(130%_150%_at_88%_0%,#0A8A5C_0%,#066F47_40%,#053D2C_100%)] shadow-[0_40px_90px_rgba(5,70,50,0.22)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
              backgroundSize: '26px 26px',
            }}
          />
          <svg
            viewBox="0 0 100 100"
            width="380"
            height="380"
            className="pointer-events-none absolute -right-[90px] -bottom-[120px] hidden opacity-[0.07] sm:block"
            aria-hidden
          >
            <path
              d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z"
              fill="#FBFCFA"
            />
          </svg>

          <div className="relative grid min-w-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex min-w-0 flex-col justify-center overflow-hidden border-b border-white/10 p-6 text-off-white sm:p-8 lg:border-r lg:border-b-0 lg:px-14 lg:py-16">
              <SectionLabel number="05" label={t.contact.sectionLabel} light />
              <h2 className="break-words font-tamil-serif text-[clamp(26px,6vw,44px)] leading-[1.18] font-bold">
                {t.contact.title}
              </h2>
              <p className="mt-4 max-w-full text-[15px] leading-[1.85] break-words text-[#DCEAE0] sm:mt-[22px] sm:max-w-[38ch] sm:text-[16.5px]">
                {t.contact.description}
              </p>
              <div className="mt-5 flex w-full max-w-full items-start gap-[11px] rounded-2xl border border-gold/45 px-4 py-3 sm:mt-[30px] sm:w-auto sm:items-center sm:self-start sm:rounded-full sm:px-5 sm:py-[11px]">
                <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-green-bright shadow-[0_0_0_3px_rgba(35,196,131,0.25)] sm:mt-0" />
                <span className="min-w-0 flex-1 break-words text-[13px] leading-[1.5] tracking-[0.5px] text-gold-pale sm:flex-none sm:text-[13.5px]">
                  {t.contact.hours}
                </span>
              </div>
              <SocialLinksRow links={siteMeta.social} variant="contact" title={t.footer.socialTitle} />
            </div>

            <div className="flex min-w-0 flex-col justify-center overflow-hidden px-6 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-12">
              {t.contact.items.map((c, i) => (
                <div
                  key={c.label}
                  className={`flex min-w-0 items-start gap-4 py-5 sm:items-center sm:gap-[22px] sm:py-6 ${i < t.contact.items.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(230,177,48,0.35)] sm:h-14 sm:w-14 sm:rounded-[14px]">
                    <ContactIcon type={c.icon} />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-accent text-[11.5px] tracking-[1.8px] text-[#9CC4AE] uppercase sm:text-[12.5px] sm:tracking-[2px]">
                      {c.label}
                    </p>
                    <p className="mt-1 break-words font-tamil-serif text-[17px] leading-[1.45] font-semibold text-off-white [overflow-wrap:anywhere] sm:mt-1.5 sm:text-[19px] sm:leading-snug">
                      {(() => {
                        const href = contactHref(c.icon, c.value)
                        if (href) {
                          return (
                            <a href={href} className="text-off-white no-underline transition hover:text-gold-pale">
                              {c.value}
                            </a>
                          )
                        }
                        return c.value
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
