import { useCallback, useEffect, useRef, useState } from 'react'
import type { HeroSlide } from '../../data/heroSlides'
import { useLanguage } from '../../i18n/LanguageContext'

const IMAGE_INTERVAL_MS = 6000

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mediaClass =
    'absolute inset-0 h-full w-full object-cover grayscale-[55%] contrast-[1.12] brightness-[0.8] saturate-[1.25]'

  const goTo = useCallback(
    (index: number) => {
      setActive((index + slides.length) % slides.length)
    },
    [slides.length],
  )

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const scheduleNext = useCallback(
    (delay: number) => {
      clearTimer()
      if (paused) return
      timerRef.current = setTimeout(next, delay)
    },
    [next, paused],
  )

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active && slides[i]?.type === 'video') {
        video.currentTime = 0
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active, slides])

  useEffect(() => {
    const slide = slides[active]
    if (!slide || paused) return

    if (slide.type === 'image') {
      scheduleNext(IMAGE_INTERVAL_MS)
      return clearTimer
    }

    const video = videoRefs.current[active]
    if (!video) {
      scheduleNext(IMAGE_INTERVAL_MS)
      return clearTimer
    }

    const onEnded = () => next()
    const fallback = setTimeout(next, 45000)

    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('ended', onEnded)
      clearTimeout(fallback)
      clearTimer()
    }
  }, [active, slides, paused, next, scheduleNext])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) setPaused(true)
    const handler = () => setPaused(reduced.matches)
    reduced.addEventListener('change', handler)
    return () => reduced.removeEventListener('change', handler)
  }, [])

  useEffect(() => () => clearTimer(), [])

  if (slides.length === 0) return null

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t.hero.carouselLabel}
    >
      {slides.map((slide, i) => {
        const isActive = i === active
        return (
          <div
            key={`slide-${i}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            {slide.type === 'image' ? (
              <img
                src={slide.src}
                alt={slide.alt}
                className={mediaClass}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                src={slide.src}
                poster={slide.poster}
                className={mediaClass}
                muted
                playsInline
                loop={false}
                preload={i === 0 ? 'auto' : 'metadata'}
                aria-label={slide.alt}
              />
            )}
          </div>
        )
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute top-1/2 left-4 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[rgba(4,46,33,0.45)] text-off-white backdrop-blur-sm transition hover:border-gold/50 hover:bg-[rgba(4,46,33,0.65)]"
            aria-label={t.hero.prevSlide}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 right-4 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[rgba(4,46,33,0.45)] text-off-white backdrop-blur-sm transition hover:border-gold/50 hover:bg-[rgba(4,46,33,0.65)] xl:right-[calc(max(32px,(100%-1240px)/2+32px)+124px)]"
            aria-label={t.hero.nextSlide}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-[170px] left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2.5 md:bottom-[190px]">
            {slides.map((slide, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => goTo(i)}
                className={`flex items-center gap-1.5 rounded-full transition ${
                  i === active
                    ? 'bg-gold/90 px-3 py-1.5'
                    : 'h-2.5 w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`${slide.alt} — ஸ்லைடு ${i + 1}`}
                aria-current={i === active}
              >
                {i === active && (
                  <span className="font-accent text-[10px] tracking-wider text-green-dark uppercase">
                    {slide.type === 'video' ? '▶ Video' : `${i + 1}/${slides.length}`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
