import { useLanguage } from '../../i18n/LanguageContext'
import { gaugeTicks } from '../../data/content'

export function WaterGauge() {
  const { t, lang, water } = useLanguage()
  const fillPercent = Math.min(100, Math.max(0, (water.currentLevel / water.capacity) * 100))
  const targetPercent = Math.min(100, Math.max(0, (water.targetLevel / water.capacity) * 100))
  const label = lang === 'ta' ? `${water.targetLevel} அடி` : `${water.targetLevel} ft`
  const gaugeLabel = lang === 'ta' ? 'நீர்மட்டம்' : 'Water Level'
  const lastUpdated = lang === 'ta' ? water.lastUpdatedTa : water.lastUpdatedEn

  return (
    <div
      className="pointer-events-none absolute top-1/2 z-[2] hidden h-[62vh] max-h-[560px] w-[108px] -translate-y-1/2 flex-col justify-end md:flex"
      style={{ right: 'max(32px, calc((100% - 1240px) / 2 + 32px))' }}
    >
      <div className="relative flex flex-1 border-l-2 border-gold-pale/50">
        {gaugeTicks.map((tick) => (
          <div
            key={tick.label}
            className="absolute left-0 flex -translate-y-1/2 items-center gap-2"
            style={{ bottom: tick.pos }}
          >
            <span className="h-px bg-gold-pale/55" style={{ width: tick.len }} />
            <span className="font-accent text-[11px] text-gold-pale/70">{tick.label}</span>
          </div>
        ))}
        <div
          className="absolute right-[-2px] bottom-0 left-0.5 border-t-2 border-green-bright bg-gradient-to-t from-green-bright/42 to-green-light/16 shadow-[0_0_24px_rgba(35,196,131,0.5)]"
          style={{ height: `${fillPercent}%` }}
        />
        <div
          className="absolute right-[-14px] left-[-2px] flex -translate-y-1/2 items-center gap-2"
          style={{ bottom: `${targetPercent}%` }}
        >
          <span className="h-0.5 w-[34px] bg-gold" />
          <span className="rounded-[5px] bg-gold px-2.5 py-0.5 font-accent text-sm font-bold whitespace-nowrap text-footer">
            {t.hero.waterLevel || label}
          </span>
        </div>
      </div>
      <span className="mt-3.5 text-center font-accent text-[10px] tracking-[2px] text-gold-pale/60 uppercase">
        {gaugeLabel}
      </span>
      {lastUpdated && (
        <span className="mt-1.5 text-center font-accent text-[9px] tracking-[0.5px] text-gold-pale/45">
          {lastUpdated}
        </span>
      )}
    </div>
  )
}
