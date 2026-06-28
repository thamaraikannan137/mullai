import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from '../ui/ScrollToTop'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-hidden bg-cream font-tamil-sans text-[#15241D]">
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
