import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { execute, migrate, queryOne } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadSeedData() {
  const candidates = [
    path.join(__dirname, 'seed-data.json'),
    path.join(__dirname, '..', 'seed-data.json'),
  ]
  const seedPath = candidates.find((p) => fs.existsSync(p))
  if (!seedPath) {
    throw new Error('seed-data.json not found. Run: npx tsx scripts/export-seed-data.ts')
  }
  return JSON.parse(fs.readFileSync(seedPath, 'utf8')) as {
    translations: { ta: { news: { items: Array<Record<string, string>> } }; en: { news: { items: Array<Record<string, string>> } } }
    heroSlides: unknown[]
    siteImages: Record<string, string>
  }
}

export async function seedDatabase(options?: { force?: boolean }) {
  await migrate()

  const existing = await queryOne<{ id: number }>(`SELECT id FROM site_content WHERE id = 1`)
  if (existing && !options?.force && process.env.FORCE_SEED !== '1') {
    return false
  }

  const { translations, heroSlides, siteImages } = loadSeedData()

  if (existing) {
    await execute(`DELETE FROM site_content`)
    await execute(`DELETE FROM news_posts`)
    await execute(`DELETE FROM join_submissions`)
  }

  const waterSettings = JSON.stringify({
    currentLevel: 142,
    targetLevel: 152,
    capacity: 152,
    status: 'rising',
    lastUpdatedTa: 'ஜூன் 25, 2026',
    lastUpdatedEn: '25 June 2026',
  })

  const siteMeta = JSON.stringify({
    seo: {
      titleTa:
        'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் | Mullai Periyar Single-Crop Irrigation Farmers\' Association',
      titleEn:
        'Mullai Periyar Single-Crop Irrigation Farmers\' Association | Mullai Periyar Sangam',
      descriptionTa:
        'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம் — பெரியாறு நீரை நம்பி வாழும் தென் தமிழ்நாட்டு விவசாயிகளின் உரிமைகளைப் பாதுகாக்கும் கூட்டமைப்பு.',
      descriptionEn:
        'Mullai Periyar Single-Crop Irrigation Farmers\' Association — advocating for fair water rights for farmers across five southern Tamil Nadu districts.',
    },
    about: { districtCount: 5, badgeYear: 1895 },
    social: { facebook: '', instagram: '', youtube: '' },
  })

  await execute(
    `INSERT INTO site_content (id, content_ta, content_en, hero_slides, images, water_settings, site_meta)
     VALUES (1, $1, $2, $3, $4, $5, $6)`,
    [
      JSON.stringify(translations.ta),
      JSON.stringify(translations.en),
      JSON.stringify(heroSlides),
      JSON.stringify(siteImages),
      waterSettings,
      siteMeta,
    ],
  )

  for (const [index, item] of translations.ta.news.items.entries()) {
    const enItem = translations.en.news.items[index]
    await execute(
      `INSERT INTO news_posts (id, tag_ta, tag_en, published_at, title_ta, title_en, body_ta, body_en, image_url, media_type, is_published, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, $11)`,
      [
        randomUUID(),
        item.tag,
        enItem?.tag ?? item.tag,
        item.date,
        item.title,
        enItem?.title ?? item.title,
        item.body,
        enItem?.body ?? item.body,
        item.img,
        'image',
        index,
      ],
    )
  }

  const email = process.env.ADMIN_INITIAL_EMAIL || 'admin@mullaiperiyar.org'
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'admin123'
  const hash = bcrypt.hashSync(password, 10)

  await execute(`DELETE FROM users WHERE email = $1`, [email])
  await execute(
    `INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)`,
    [randomUUID(), email, hash, 'Admin', 'super_admin'],
  )

  return true
}
