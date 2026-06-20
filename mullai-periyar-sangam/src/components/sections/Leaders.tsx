import { ImageSlot } from '../ui/ImageSlot'
import { SectionLabel } from '../ui/SectionLabel'
import { bearers, president } from '../../data/content'

export function Leaders() {
  return (
    <section id="leaders" className="bg-cream py-[122px]">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="mb-[54px]">
          <SectionLabel number="02" label="Leadership" />
        </div>

        <div className="grid items-stretch gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="relative min-h-[440px] overflow-hidden rounded-[20px] border border-[#E4EDE7] bg-green-dark shadow-[0_30px_70px_rgba(5,70,50,0.22)]">
            <ImageSlot
              src={president.photo!}
              alt={president.name}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,46,33,0.82)] via-[rgba(4,46,33,0.12)] to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 text-off-white">
              <h3 className="font-tamil-serif text-[27px] leading-tight font-bold">{president.name}</h3>
              <div className="mt-2 flex items-center gap-2.5">
                <span className="h-px w-5 bg-gold" />
                <span className="text-[13.5px] font-semibold tracking-[1.5px] text-gold-pale uppercase">
                  {president.role_ta} · {president.role_en}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-accent text-[84px] leading-[0.4] text-gold">“</div>
            <p className="font-tamil-serif text-[clamp(21px,2.3vw,29px)] leading-normal font-medium tracking-[-0.2px] text-[#0B3325]">
              பெரியாறு நீர் எங்கள் மூதாதையர் உழைப்பின் பலன். அந்த நீரை, அதன் முழு உரிமையை,
              அடுத்த தலைமுறைக்குக் கடத்துவதே எங்கள் சங்கத்தின் கடமை.
            </p>
            <p className="mt-6 text-[16.5px] leading-[1.85] text-text-body">
              தேனி முதல் ராமநாதபுரம் வரை பரந்த ஐந்து மாவட்ட விவசாயிகளின் குரலாக, நீர்மட்டக்
              கோரிக்கையையும் அணைப் பாதுகாப்பையும் அரசின் கவனத்திற்கு இடைவிடாமல் எடுத்துச்
              செல்கிறோம்.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#E4EDE7] pt-6">
              <span className="font-accent text-[30px] font-semibold text-green-dark italic">
                {president.name}
              </span>
              <span className="text-[13px] tracking-[0.5px] text-text-muted">
                தலைவர், முல்லைப் பெரியாறு சங்கம்
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#E4EDE7] pt-12">
          <p className="mb-6 font-accent text-[13px] tracking-[3px] text-gold-dark uppercase">
            Office Bearers · நிர்வாகிகள்
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bearers.map((ld) => (
              <div
                key={ld.role_ta}
                className="flex items-center gap-5 rounded-2xl border border-[#E4EDE7] bg-white p-6 shadow-[0_10px_30px_rgba(5,70,50,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(5,70,50,0.10)]"
              >
                <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-mid to-green-dark shadow-[inset_0_0_0_1px_rgba(230,177,48,0.5)]">
                  <span className="font-accent text-2xl font-semibold text-gold-pale">
                    {ld.initial}
                  </span>
                </div>
                <div>
                  <h3 className="font-tamil-serif text-lg font-bold text-green-dark">{ld.name}</h3>
                  <p className="mt-1 text-[13px] font-semibold tracking-wide text-green-mid">
                    {ld.role_ta}
                  </p>
                  <p className="font-accent text-[13.5px] text-gold-dark italic">{ld.role_en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
