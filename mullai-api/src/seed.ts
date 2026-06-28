import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { db, migrate } from './db.js'

async function seed() {
  migrate()

  const { translations } = await import(
    '../../mullai-periyar-sangam/src/i18n/translations.ts'
  )
  const { heroSlides } = await import('../../mullai-periyar-sangam/src/data/heroSlides.ts')

  const siteImages = {
    about:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1200',
    join: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1200',
    presidentPhoto: '',
  }

  db.prepare(`DELETE FROM site_content`).run()
  db.prepare(`DELETE FROM news_posts`).run()
  db.prepare(`DELETE FROM join_submissions`).run()

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

  db.prepare(
    `INSERT INTO site_content (id, content_ta, content_en, hero_slides, images, water_settings, site_meta) VALUES (1, ?, ?, ?, ?, ?, ?)`,
  ).run(
    JSON.stringify(translations.ta),
    JSON.stringify(translations.en),
    JSON.stringify(heroSlides),
    JSON.stringify(siteImages),
    waterSettings,
    siteMeta,
  )

  const insertNews = db.prepare(
    `INSERT INTO news_posts (id, tag_ta, tag_en, published_at, title_ta, title_en, body_ta, body_en, image_url, media_type, is_published, sort_order)
     VALUES (@id, @tag_ta, @tag_en, @published_at, @title_ta, @title_en, @body_ta, @body_en, @image_url, @media_type, 1, @sort_order)`,
  )

  translations.ta.news.items.forEach((item, index) => {
    const enItem = translations.en.news.items[index]
    insertNews.run({
      id: randomUUID(),
      tag_ta: item.tag,
      tag_en: enItem?.tag ?? item.tag,
      published_at: item.date,
      title_ta: item.title,
      title_en: enItem?.title ?? item.title,
      body_ta: item.body,
      body_en: enItem?.body ?? item.body,
      image_url: item.img,
      media_type: 'image',
      sort_order: index,
    })
  })

  const email = process.env.ADMIN_INITIAL_EMAIL || 'admin@mullaiperiyar.org'
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'admin123'
  const hash = bcrypt.hashSync(password, 10)

  db.prepare(`DELETE FROM users WHERE email = ?`).run(email)
  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), email, hash, 'Admin', 'super_admin')

  console.log('Database seeded successfully.')
  console.log(`Admin login: ${email} / ${password}`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
