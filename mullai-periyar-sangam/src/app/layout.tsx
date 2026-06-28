import type { Metadata } from 'next'
import { Noto_Serif_Tamil, Anek_Tamil, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { PublicProviders } from '@/components/providers/PublicProviders'

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ['tamil'],
  variable: '--font-tamil-serif',
  weight: ['400', '500', '600', '700'],
})

const anekTamil = Anek_Tamil({
  subsets: ['latin'],
  variable: '--font-tamil-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title:
    "முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் | Mullai Periyar Single-Crop Irrigation Farmers' Association",
  description:
    'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் — பெரியாறு நீரை நம்பி வாழும் தென் தமிழ்நாட்டு விவசாயிகளின் உரிமைகளைப் பாதுகாக்கும் கூட்டமைப்பு.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body className={`${notoSerifTamil.variable} ${anekTamil.variable} ${cormorant.variable}`}>
        <PublicProviders>{children}</PublicProviders>
      </body>
    </html>
  )
}
