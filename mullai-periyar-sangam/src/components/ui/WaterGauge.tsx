import { gaugeTicks } from '../../data/content'

export function WaterGauge() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 z-[2] hidden h-[62vh] max-h-[560px] w-[108px] -translate-y-1/2 flex-col justify-end xl:flex"
      style={{ right: 'max(32px, calc((100% - 1240px) / 2 + 32px))' }}
    >
      <div className="relative flex flex-1 border-l-2 border-gold-pale/50">
        {gaugeTicks.map((t) => (
          <div
            key={t.label}
            className="absolute left-0 flex -translate-y-1/2 items-center gap-2"
            style={{ bottom: t.pos }}
          >
            <span className="h-px bg-gold-pale/55" style={{ width: t.len }} />
            <span className="font-accent text-[11px] text-gold-pale/70">{t.label}</span>
          </div>
        ))}
        <div
          className="absolute right-[-2px] bottom-0 left-0.5 border-t-2 border-green-bright bg-gradient-to-t from-green-bright/42 to-green-light/16 shadow-[0_0_24px_rgba(35,196,131,0.5)]"
          style={{ height: '85%' }}
        />
        <div className="absolute right-[-14px] bottom-[85%] left-[-2px] flex -translate-y-1/2 items-center gap-2">
          <span className="h-0.5 w-[34px] bg-gold" />
          <span className="rounded-[5px] bg-gold px-2.5 py-0.5 font-accent text-sm font-bold whitespace-nowrap text-footer">
            152 அடி
          </span>
        </div>
      </div>
      <span className="mt-3.5 text-center font-accent text-[10px] tracking-[2px] text-gold-pale/60 uppercase">
        Water Level
      </span>
    </div>
  )
}
