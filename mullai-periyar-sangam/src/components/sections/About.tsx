import { ImageSlot } from '../ui/ImageSlot'
import { SectionLabel } from '../ui/SectionLabel'
import { images } from '../../data/content'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1240px] px-8 pt-[120px] pb-6">
      <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-[72px]">
        <div>
          <SectionLabel number="01" label="About the Association" />
          <h2 className="font-tamil-serif text-[clamp(30px,3.8vw,46px)] leading-[1.18] font-bold tracking-[-0.3px] text-green-dark">
            மண்ணையும் நீரையும்
            <br />
            நேசிக்கும் சங்கம்
          </h2>
          <p className="mt-6 text-[17px] leading-[1.85] text-text-body">
            முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம், பெரியாறு அணையின் நீரை நம்பி ஒருபோக
            சாகுபடி செய்யும் தென் தமிழ்நாட்டு விவசாயிகளின் கூட்டமைப்பாகும். தண்ணீர் காலத்தோடு
            திறக்கப்படுவதையும், நீர்மட்டம் முழுமையாகப் பேணப்படுவதையும் உறுதிப்படுத்த இச்சங்கம்
            தொடர்ந்து குரல் கொடுத்து வருகிறது.
          </p>
          <p className="mt-4 text-[17px] leading-[1.85] text-text-body">
            அணைப் பாதுகாப்பு, நியாயமான நீர்ப்பகிர்வு, பாசனப் பகுதி விவசாயிகளின் வாழ்வாதாரம் —
            இவற்றை மையமாகக் கொண்டு போராட்டங்கள், கூட்டங்கள், விழிப்புணர்வுப் பணிகளை சங்கம்
            ஒருங்கிணைக்கிறது.
          </p>
          <div className="mt-8 flex gap-9 border-t border-[#E1EAE3] pt-7">
            <div>
              <div className="font-accent text-[34px] leading-none font-semibold text-green-mid">5</div>
              <div className="mt-2 text-[13.5px] text-text-muted">பயனடையும் மாவட்டங்கள்</div>
            </div>
            <div>
              <div className="font-accent text-[34px] leading-none font-semibold text-green-mid">
                152 அடி
              </div>
              <div className="mt-2 text-[13.5px] text-text-muted">கோரும் முழு நீர்மட்டம்</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[18px] border border-[#E1EAE3] shadow-[0_30px_70px_rgba(5,70,50,0.20)]">
            <ImageSlot
              src={images.about}
              alt="தேனி மாவட்ட வயல்வெளி"
              className="h-[clamp(360px,40vw,500px)] w-full"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-[14px] border border-gold/35 bg-green-dark px-6 py-5 text-off-white shadow-[0_18px_40px_rgba(5,70,50,0.30)]">
            <div className="font-accent text-[38px] leading-none font-semibold text-gold-pale">1895</div>
            <div className="mt-1.5 font-tamil-serif text-[13px] text-[#CFE2D4]">
              பெரியாறு அணை அமைக்கப்பட்ட ஆண்டு
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
