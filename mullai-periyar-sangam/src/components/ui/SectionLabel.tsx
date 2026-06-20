interface SectionLabelProps {
  number: string
  label: string
  light?: boolean
}

export function SectionLabel({ number, label, light = false }: SectionLabelProps) {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <span className="font-accent text-[15px] font-semibold text-gold">{number}</span>
      <span className="h-px w-8 bg-gold" />
      <span
        className={`font-accent text-[13px] tracking-[3px] uppercase ${
          light ? 'text-gold-pale' : 'text-gold-dark'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
