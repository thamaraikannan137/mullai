import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const HEADER_OFFSET = 88

export function useHashScroll(ready: boolean) {
  const pathname = usePathname()
  const hash = typeof window !== 'undefined' ? window.location.hash : ''

  useEffect(() => {
    if (!ready || pathname !== '/' || !hash) return

    const id = hash.slice(1)
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top, behavior: 'smooth' })
    }, 80)

    return () => window.clearTimeout(timer)
  }, [hash, pathname, ready])
}
