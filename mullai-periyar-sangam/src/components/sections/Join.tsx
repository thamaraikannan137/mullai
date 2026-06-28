import { useState, type FormEvent } from 'react'
import { ImageSlot } from '../ui/ImageSlot'
import { submitJoin } from '../../lib/public-api'
import { useLanguage } from '../../i18n/LanguageContext'

interface FormState {
  name: string
  father_name: string
  phone: string
  aadhaar: string
  village: string
  email: string
}

const emptyForm: FormState = {
  name: '',
  father_name: '',
  phone: '',
  aadhaar: '',
  village: '',
  email: '',
}

export function Join() {
  const { t, images } = useLanguage()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [joined, setJoined] = useState(false)
  const [joinedName, setJoinedName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      await submitJoin({
        name: form.name.trim(),
        father_name: form.father_name.trim(),
        phone: form.phone.trim(),
        aadhaar: form.aadhaar.replace(/\s/g, ''),
        village: form.village.trim(),
        email: form.email.trim(),
      })
      setJoined(true)
      setJoinedName(form.name.trim() || t.join.defaultName)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.join.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'rounded-[10px] border border-[#D5E0D8] px-4 py-3.5 text-[15px] text-[#15241D] outline-none transition focus:border-green-mid focus:shadow-[0_0_0_3px_rgba(6,122,82,0.12)]'

  const fields: { key: keyof FormState; label: string; placeholder: string; type?: string; inputMode?: 'numeric' | 'email' | 'tel' }[] = [
    { key: 'name', label: t.join.nameLabel, placeholder: t.join.namePlaceholder },
    { key: 'father_name', label: t.join.fatherNameLabel, placeholder: t.join.fatherNamePlaceholder },
    { key: 'phone', label: t.join.phoneLabel, placeholder: t.join.phonePlaceholder, type: 'tel', inputMode: 'tel' },
    { key: 'aadhaar', label: t.join.aadhaarLabel, placeholder: t.join.aadhaarPlaceholder, type: 'text', inputMode: 'numeric' },
    { key: 'village', label: t.join.villageLabel, placeholder: t.join.villagePlaceholder },
    { key: 'email', label: t.join.emailLabel, placeholder: t.join.emailPlaceholder, type: 'email', inputMode: 'email' },
  ]

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
              {fields.map(({ key, label, placeholder, type = 'text', inputMode }) => (
                <label
                  key={key}
                  className="flex flex-col gap-2 text-[13px] font-semibold tracking-[0.3px] text-text-body"
                >
                  {label}
                  <input
                    type={type}
                    inputMode={inputMode}
                    required
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={inputClass}
                    maxLength={key === 'aadhaar' ? 14 : undefined}
                  />
                </label>
              ))}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-[10px] bg-green-mid px-6 py-4 text-[15px] font-semibold text-off-white transition hover:-translate-y-px hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? '…' : t.join.submitBtn}
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
