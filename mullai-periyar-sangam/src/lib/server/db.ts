import { Pool } from '@neondatabase/serverless'

let pool: Pool | null = null

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required (Neon PostgreSQL connection string)')
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getPool().query(text, params)
  return result.rows as T[]
}

export async function queryOne<T>(text: string, params: unknown[] = []): Promise<T | undefined> {
  const rows = await query<T>(text, params)
  return rows[0]
}

export async function execute(text: string, params: unknown[] = []): Promise<number> {
  const result = await getPool().query(text, params)
  return result.rowCount ?? 0
}

export async function migrate() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'editor',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content_ta TEXT NOT NULL,
      content_en TEXT NOT NULL,
      hero_slides TEXT NOT NULL,
      images TEXT NOT NULL,
      water_settings TEXT,
      site_meta TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS news_posts (
      id TEXT PRIMARY KEY,
      tag_ta TEXT NOT NULL,
      tag_en TEXT NOT NULL,
      published_at TEXT NOT NULL,
      title_ta TEXT NOT NULL,
      title_en TEXT NOT NULL,
      body_ta TEXT NOT NULL,
      body_en TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'image',
      is_published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS join_submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      father_name TEXT NOT NULL DEFAULT '',
      village TEXT NOT NULL,
      phone TEXT NOT NULL,
      aadhaar TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      source TEXT NOT NULL DEFAULT 'website',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await getPool().query(`UPDATE join_submissions SET source = 'manual' WHERE source = 'admin'`)

  const defaultWater = JSON.stringify({
    currentLevel: 142,
    targetLevel: 152,
    capacity: 152,
    status: 'rising',
    lastUpdatedTa: 'ஜூன் 25, 2026',
    lastUpdatedEn: '25 June 2026',
  })
  const defaultMeta = JSON.stringify({
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

  await getPool().query(
    `UPDATE site_content
     SET water_settings = COALESCE(water_settings, $1),
         site_meta = COALESCE(site_meta, $2)
     WHERE id = 1`,
    [defaultWater, defaultMeta],
  )
}
