import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.join(__dirname, '..', 'seed-data.json')

const { translations } = await import(
  '../../mullai-periyar-sangam/src/i18n/translations.ts'
)
const { heroSlides } = await import('../../mullai-periyar-sangam/src/data/heroSlides.ts')

const payload = {
  translations,
  heroSlides,
  siteImages: {
    about:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1200',
    join: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1200',
    presidentPhoto: '',
  },
}

fs.writeFileSync(outPath, JSON.stringify(payload))
console.log(`Wrote ${outPath}`)
