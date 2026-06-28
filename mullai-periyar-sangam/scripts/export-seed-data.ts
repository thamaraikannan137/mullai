import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.join(__dirname, '..', 'seed-data.json')

async function main() {
  const { translations } = await import('../src/i18n/translations')
  const { heroSlides } = await import('../src/data/heroSlides')

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
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
