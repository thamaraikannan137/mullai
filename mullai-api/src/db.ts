import Database from 'better-sqlite3'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bundledDataDir = fs.existsSync(path.join(__dirname, 'data'))
  ? path.join(__dirname, 'data')
  : path.join(__dirname, '..', 'data')

function resolveDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH

  const isCompute = Boolean(process.env.AWS_EXECUTION_ENV)
  const dataDir = isCompute ? path.join(os.tmpdir(), 'mullai-data') : bundledDataDir

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'mullai.db')
  const bundledDb = path.join(bundledDataDir, 'mullai.db')

  if (!fs.existsSync(dbPath) && fs.existsSync(bundledDb)) {
    fs.copyFileSync(bundledDb, dbPath)
  }

  return dbPath
}

const dbPath = resolveDbPath()
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'editor',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content_ta TEXT NOT NULL,
      content_en TEXT NOT NULL,
      hero_slides TEXT NOT NULL,
      images TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const columns = db.prepare(`PRAGMA table_info(join_submissions)`).all() as { name: string }[]
  if (!columns.some((c) => c.name === 'source')) {
    db.exec(`ALTER TABLE join_submissions ADD COLUMN source TEXT NOT NULL DEFAULT 'website'`)
  }
  if (!columns.some((c) => c.name === 'father_name')) {
    db.exec(`ALTER TABLE join_submissions ADD COLUMN father_name TEXT NOT NULL DEFAULT ''`)
  }
  if (!columns.some((c) => c.name === 'aadhaar')) {
    db.exec(`ALTER TABLE join_submissions ADD COLUMN aadhaar TEXT NOT NULL DEFAULT ''`)
  }
  if (!columns.some((c) => c.name === 'email')) {
    db.exec(`ALTER TABLE join_submissions ADD COLUMN email TEXT NOT NULL DEFAULT ''`)
  }
  db.exec(`UPDATE join_submissions SET source = 'manual' WHERE source = 'admin'`)

  const siteColumns = db.prepare(`PRAGMA table_info(site_content)`).all() as { name: string }[]
  if (!siteColumns.some((c) => c.name === 'water_settings')) {
    db.exec(`ALTER TABLE site_content ADD COLUMN water_settings TEXT`)
  }
  if (!siteColumns.some((c) => c.name === 'site_meta')) {
    db.exec(`ALTER TABLE site_content ADD COLUMN site_meta TEXT`)
  }

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
  db.prepare(
    `UPDATE site_content SET water_settings = COALESCE(water_settings, ?), site_meta = COALESCE(site_meta, ?) WHERE id = 1`,
  ).run(defaultWater, defaultMeta)

  const newsColumns = db.prepare(`PRAGMA table_info(news_posts)`).all() as { name: string }[]
  if (!newsColumns.some((c) => c.name === 'media_type')) {
    db.exec(`ALTER TABLE news_posts ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image'`)
  }
}

migrate()
