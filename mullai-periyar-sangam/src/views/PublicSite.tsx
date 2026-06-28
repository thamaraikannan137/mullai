import { PublicLayout } from '../components/layout/PublicLayout'
import { useHashScroll } from '../hooks/useHashScroll'
import { useLanguage } from '../i18n/LanguageContext'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { QuoteBand } from '../components/sections/QuoteBand'
import { Leaders } from '../components/sections/Leaders'
import { Demands } from '../components/sections/Demands'
import { News } from '../components/sections/News'
import { Join } from '../components/sections/Join'
import { Contact } from '../components/sections/Contact'

export function PublicSite() {
  const { contentReady } = useLanguage()
  useHashScroll(contentReady)

  return (
    <PublicLayout>
      <Hero />
      <About />
      <QuoteBand />
      <Leaders />
      <Demands />
      <News />
      <Join />
      <Contact />
    </PublicLayout>
  )
}
