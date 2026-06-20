import { useState, type FormEvent } from 'react'
import { ImageSlot } from '../ui/ImageSlot'
import { images } from '../../data/content'
import { useLanguage } from '../../i18n/LanguageContext'

interface FormState {
  name: string
  village: string
  phone: string
}

export function Join() {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>({ name: '', village: '', phone: '' })
  const [joined, setJoined] = useState(false)
  const [joinedName, setJoinedName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setJoined(true)
    setJoinedName(form.name.trim() || t.join.defaultName)
  }

  const inputClass =
    'rounded-[10px] border border-[#D5E0D8] px-4 py-3.5 text-[15px] text-[#15241D] outline-none transition focus:border-green-mid focus:shadow-[0_0_0_3px_rgba(6,122,82,0.12)]'

  return (
    <section id="join" className="mx-auto max-w-[1240px] px-8 py-[118px]">
      <div className="grid overflow-hidden rounded-[24px] border border-[#E1EAE3] shadow-[0_30px_70px_rgba(5,70,50,0.10)] lg:grid-cols-2">
        <div className="relative flex flex-col justify-center overflow-hidden px-[52px] py-[60px] text-off-white">
          <ImageSlot src={images.join} alt="" className="absolute inset-0 z-0 h-full w-full" />
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(120% 120% at 0% 0%, rgba(5,70,50,0.95), rgba(4,52,37,0.88))',
            }}
          />
          <div className="relative z-[2]">
            <div className="mb-[18px] flex items-center gap-3">
              <span className="h-px w-[34px] bg-gold" />
              <span className="font-accent text-[13px] tracking-[3px] text-gold-pale uppercase">
                {t.join.sectionLabel}
              </span>
            </div>
            <h2 className="font-tamil-serif text-[clamp(28px,3.2vw,42px)] leading-[1.22] font-bold">
              {t.join.title}
            </h2>
            <p className="mt-[22px] text-base leading-[1.85] text-[#DCEAE0]">{t.join.description}</p>
            <div className="mt-[30px] flex items-center gap-2.5 text-[14.5px] text-[#CFE2D4]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6B130" strokeWidth="2.4">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {t.join.freeNote}
            </div>
          </div>
        </div>

        <div className="bg-white px-[52px] py-[60px]">
          {!joined ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-[13px] font-semibold tracking-[0.3px] text-text-body">
                {t.join.nameLabel}
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t.join.namePlaceholder}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2 text-[13px] font-semibold tracking-[0.3px] text-text-body">
                {t.join.villageLabel}
                <input
                  type="text"
                  required
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  placeholder={t.join.villagePlaceholder}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2 text-[13px] font-semibold tracking-[0.3px] text-text-body">
                {t.join.phoneLabel}
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t.join.phonePlaceholder}
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                className="mt-2 rounded-[10px] bg-green-mid px-6 py-4 text-[15px] font-semibold text-off-white transition hover:-translate-y-px hover:bg-green-dark"
              >
                {t.join.submitBtn}
              </button>
            </form>
          ) : (
            <div className="px-2.5 py-9 text-center">
              <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-green-pale">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#067A52" strokeWidth="2.4">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-6 font-tamil-serif text-[25px] font-bold text-green-dark">
                {t.join.thanks}, {joinedName}!
              </h3>
              <p className="mt-3 text-[15.5px] leading-[1.75] text-text-body">{t.join.thanksMsg}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
