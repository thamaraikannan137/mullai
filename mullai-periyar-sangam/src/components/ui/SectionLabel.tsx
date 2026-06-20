interface SectionLabelProps {
  number: string
  label: string
  light?: boolean
}

export function SectionLabel({ number, label, light = false }: SectionLabelProps) {
  return (
    <div className="mb-5 flex min-w-0 items-center gap-3.5">
      <span className="shrink-0 font-accent text-[15px] font-semibold text-gold">{number}</span>
      <span className="h-px w-8 shrink-0 bg-gold" />
      <span
        className={`min-w-0 break-words font-accent text-[11px] tracking-[2px] uppercase sm:text-[13px] sm:tracking-[3px] ${
          light ? 'text-gold-pale' : 'text-gold-dark'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
