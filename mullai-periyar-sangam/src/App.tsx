import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { QuoteBand } from './components/sections/QuoteBand'
import { Leaders } from './components/sections/Leaders'
import { Demands } from './components/sections/Demands'
import { News } from './components/sections/News'
import { Join } from './components/sections/Join'
import { Contact } from './components/sections/Contact'
import { ScrollToTop } from './components/ui/ScrollToTop'

function App() {
  return (
    <div className="overflow-x-hidden bg-cream font-tamil-sans text-[#15241D]">
      <Header />
      <main>
        <Hero />
        <About />
        <QuoteBand />
        <Leaders />
        <Demands />
        <News />
        <Join />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
