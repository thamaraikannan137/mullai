import { SectionLabel } from '../ui/SectionLabel'
import { contacts } from '../../data/content'

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

export function Contact() {
  return (
    <section id="contact" className="bg-green-pale py-[118px]">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="relative overflow-hidden rounded-[26px] bg-[radial-gradient(130%_150%_at_88%_0%,#0A8A5C_0%,#066F47_40%,#053D2C_100%)] shadow-[0_40px_90px_rgba(5,70,50,0.22)]">
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
            className="pointer-events-none absolute -right-[90px] -bottom-[120px] opacity-[0.07]"
            aria-hidden
          >
            <path
              d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z"
              fill="#FBFCFA"
            />
          </svg>

          <div className="relative grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center border-b border-white/10 p-12 text-off-white lg:border-r lg:border-b-0 lg:px-14 lg:py-16">
              <SectionLabel number="05" label="Get in Touch" light />
              <h2 className="font-tamil-serif text-[clamp(30px,3.6vw,44px)] leading-[1.18] font-bold">
                தொடர்பு கொள்ள
              </h2>
              <p className="mt-[22px] max-w-[38ch] text-[16.5px] leading-[1.85] text-[#DCEAE0]">
                கோரிக்கைகள், உறுப்பினர் சேர்க்கை, நிகழ்வுத் தகவல்கள் — எதற்கும் சங்க
                அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள். உங்கள் குரல் எங்கள் வலிமை.
              </p>
              <div className="mt-[30px] inline-flex items-center gap-[11px] self-start rounded-full border border-gold/45 px-5 py-[11px]">
                <span className="h-[7px] w-[7px] rounded-full bg-green-bright shadow-[0_0_0_3px_rgba(35,196,131,0.25)]" />
                <span className="text-[13.5px] tracking-[0.5px] text-gold-pale">
                  திங்கள் – சனி · காலை 10 – மாலை 6
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center px-12 py-10 lg:px-14 lg:py-12">
              {contacts.map((c, i) => (
                <div
                  key={c.label}
                  className={`flex items-center gap-[22px] py-6 ${i < contacts.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(230,177,48,0.35)]">
                    <ContactIcon type={c.icon} />
                  </div>
                  <div>
                    <p className="font-accent text-[12.5px] tracking-[2px] text-[#9CC4AE] uppercase">
                      {c.label}
                    </p>
                    <p className="mt-1.5 font-tamil-serif text-[19px] leading-snug font-semibold break-words text-off-white">
                      {c.value}
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
