# Mullai Periyar Sangam — Admin Panel Plan

## Overview

Build a secure **admin panel** so association staff can update the public website without editing code or redeploying for every text change.

**Public site today:** static React SPA (`mullai-periyar-sangam/`) — all content lives in TypeScript files and is baked in at build time.

**Target:** staff log in to an admin app, edit Tamil/English content, manage news and media, and view membership form submissions. Changes appear on the live site after save (or short cache refresh).

**Primary users:** 1–3 association office staff (Tamil-first UI, optional English).

**Design reference:** [`Admin panel creation/Admin Panel.dc.html`](Admin%20panel%20creation/Admin%20Panel.dc.html) — the implemented admin UI follows this mockup exactly (sidebar, dashboard, members table, news cards, water level, contact/settings, modal, toast).

---

## Goals

| Goal                                                        | Priority |
| ----------------------------------------------------------- | -------- |
| Edit news / announcements (add, edit, delete, publish)      | P0       |
| View membership (Join) form submissions                     | P0       |
| Edit contact info (phone, email, address, hours)            | P0       |
| Edit leaders (president + office bearers, photo)            | P1       |
| Edit demands list                                           | P1       |
| Manage hero carousel (images / video)                       | P1       |
| Edit bilingual site copy (hero, about, quote, footer, etc.) | P1       |
| Upload / replace images (media library)                     | P2       |
| Edit SEO (page title, meta description)                     | P2       |
| Manage admin users (invite, disable)                        | P2       |

---

## What the Admin Must Manage

Mapped from the current codebase:

### Content domains

| Module             | Public source today                                        | Editable fields                                                                                |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Site settings**  | `index.html`, `translations.ts`                            | Site name lines, SEO title & description, copyright, tagline                                   |
| **Navigation**     | `translations.ts` → `nav`                                  | Label + anchor href per link                                                                   |
| **Hero**           | `translations.ts` → `hero`, `heroSlides.ts`, `content.ts`  | Title lines, subtitle, description, CTAs, districts, stats, water level label, carousel slides |
| **About**          | `translations.ts` → `about`, `content.ts` → `images.about` | Section copy, stats labels, badge text, about image                                            |
| **Quote band**     | `translations.ts` → `quote`                                | Quote text, attribution                                                                        |
| **Leaders**        | `translations.ts` → `leaders`, `content.ts` → `president`  | President name/roles/bio/quote, bearers (name, role, initial), president photo                 |
| **Demands**        | `translations.ts` → `demands`                              | Section intro, numbered items (`num`, `text`, optional `sub`)                                  |
| **News**           | `translations.ts` → `news`                                 | Tag, date, title, body, image URL per article                                                  |
| **Join form copy** | `translations.ts` → `join`                                 | Form labels, placeholders, success messages (not submissions)                                  |
| **Contact**        | `translations.ts` → `contact`                              | Title, description, hours, phone / email / address                                             |
| **Footer**         | `translations.ts` → `footer`                               | Description, district list, section titles                                                     |
| **Media**          | `src/assets/`, Wikimedia URLs                              | Uploaded files + URLs used across sections                                                     |

### Data that does not exist yet (new)

| Module                     | Notes                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Membership submissions** | `Join.tsx` only shows client-side success — no storage. Admin needs a submissions inbox with name, village, phone, submitted date, export CSV. |

### Hardcoded today (move into CMS)

| Item                                          | Current location            |
| --------------------------------------------- | --------------------------- |
| Section numbers `01`–`05`                     | Each section component      |
| About stat value `5`, badge year `1895`       | `About.tsx`                 |
| Water gauge fill `85%`, label `"Water Level"` | `WaterGauge.tsx`            |
| Gauge tick marks                              | `content.ts` → `gaugeTicks` |

---

## Architecture

### Approach: admin inside the main site at `/admin`

The admin panel lives **inside the same React app** as the public website (`mullai-periyar-sangam/`). Staff open **`/admin`** on the same domain — no separate admin subdomain or repo.

```
mullai/
├── mullai-periyar-sangam/     # Public website + admin UI (single Vite app)
│   └── src/
│       ├── components/        # Public site sections
│       ├── admin/             # Admin panel (/admin/*)
│       └── ...
├── mullai-api/                # Backend API (Node/Express + SQLite dev / Postgres prod)
└── admin.md                   # This document
```

**Why `/admin` in the same app**

- One Amplify deploy — same build, same domain
- Shared Tailwind tokens, fonts, and TypeScript types with the public site
- Simpler local dev: `npm run dev` serves both `/` and `/admin`
- React Router splits public vs admin; admin code can be lazy-loaded

**URLs**

| URL                  | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `/`                  | Public marketing site                                     |
| `/admin`             | Admin dashboard (redirects to login if not authenticated) |
| `/admin/login`       | Staff login                                               |
| `/admin/news`        | News management                                           |
| `/admin/submissions` | Membership inbox                                          |
| `/admin/contact`     | Contact info editor                                       |

### Data flow

```
┌─────────────────────────────┐     GET /api/public/content
│  mullai-periyar-sangam      │ ◄────────────────────────────┐
│  /        → public site     │                              │
│  /admin/* → admin panel     │     CRUD /api/admin/*        │
└──────────────┬──────────────┘ ─────────────────────────────┤
               │ POST /api/public/join                        │
               └──────────────────────────────────────────────┤
                                                               │
                                                    ┌──────────▼──────────┐
                                                    │  mullai-api + DB      │
                                                    └───────────────────────┘
```

1. **Public site** (`/`) fetches published content from API (fallback to static `translations.ts` if API is down).
2. **Admin panel** (`/admin/*`) reads/writes via authenticated admin API.
3. **Join form** POSTs to public API → stored in DB → visible in `/admin/submissions`.

### SPA routing on Amplify

Add a redirect so `/admin` and nested paths serve `index.html` (client-side routing):

```
/*    /index.html   200
```

This is configured in `public/_redirects` inside `mullai-periyar-sangam/`.

### Removed from plan

- ~~Separate `mullai-admin/` app~~ — admin is now under `src/admin/` in the main project
- ~~Separate Amplify app for admin~~ — single deploy covers both

---

## Tech Stack

| Layer                | Choice                                                                          | Rationale                                     |
| -------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| Admin UI             | **Same app** — `src/admin/` in `mullai-periyar-sangam`                          | One deploy, shared styles/types               |
| Admin routing        | **React Router**                                                                | `/admin`, `/admin/login`, `/admin/news`, etc. |
| Admin code splitting | **`React.lazy`** for `/admin/*` routes                                          | Keeps public bundle smaller                   |
| Forms                | Controlled inputs + **Zod** validation                                          | Tamil/English field pairs                     |
| Public site data     | **React Query** or `fetch` + context                                            | Load CMS content at runtime                   |
| API                  | **Node.js + Express** (or **AWS Lambda** via Amplify Functions)                 | Simple REST, easy to host                     |
| Database             | **Neon Postgres**                                                               | Serverless Postgres, fits Amplify/serverless  |
| Auth                 | **JWT + httpOnly cookie** or **session tokens**                                 | Email + password for staff                    |
| Password hashing     | **bcrypt**                                                                      | Standard                                      |
| File uploads         | **S3** (AWS) or **Cloudinary**                                                  | Hero/news/president images                    |
| Deployment           | **AWS Amplify** — single app for public + admin; API on Render/Railway or local | Already using Amplify                         |

---

## Authentication & Security

### Login

- Email + password (association office accounts only)
- No public sign-up; super-admin creates users
- Session expires after inactivity (e.g. 8 hours)
- Optional: remember this device (longer refresh token)

### Roles (v1)

| Role            | Permissions                                |
| --------------- | ------------------------------------------ |
| **Super admin** | Everything + manage users                  |
| **Editor**      | Edit all content + view submissions        |
| **Viewer**      | Read-only submissions + content (optional) |

### Security rules

- All `/api/admin/*` routes require valid session
- Rate-limit login attempts
- HTTPS only
- Validate and sanitize all inputs (especially Tamil Unicode text)
- Audit log: who changed what and when (P2)
- Admin URL at `/admin` — not linked from public header/footer (staff bookmark it)
- CORS: allow the same site origin + localhost dev ports

---

## Database Schema (Postgres)

### Core tables

```sql
-- Admin users
users (
  id            UUID PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  role          TEXT NOT NULL,  -- 'super_admin' | 'editor' | 'viewer'
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ
)

-- Generic key-value content (bilingual JSON blobs)
content_blocks (
  id          UUID PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,  -- e.g. 'hero', 'about', 'footer', 'contact'
  data_ta     JSONB NOT NULL,
  data_en     JSONB NOT NULL,
  updated_at  TIMESTAMPTZ,
  updated_by  UUID REFERENCES users(id)
)

-- News (structured for easy listing/filtering)
news_posts (
  id          UUID PRIMARY KEY,
  tag_ta      TEXT,
  tag_en      TEXT,
  published_at DATE,
  title_ta    TEXT,
  title_en    TEXT,
  body_ta     TEXT,
  body_en     TEXT,
  image_url   TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ,
  updated_by  UUID REFERENCES users(id)
)

-- Demands (ordered list)
demands (
  id          UUID PRIMARY KEY,
  num         TEXT,           -- '01', '02', ...
  text_ta     TEXT,
  text_en     TEXT,
  sub_ta      TEXT,
  sub_en      TEXT,
  sort_order  INT,
  updated_at  TIMESTAMPTZ
)

-- Leaders
leaders (
  id          UUID PRIMARY KEY,
  type        TEXT,           -- 'president' | 'bearer'
  name_ta     TEXT,
  name_en     TEXT,
  role_ta     TEXT,
  role_en     TEXT,
  initial     TEXT,           -- avatar letter
  quote_ta    TEXT,           -- president only
  quote_en    TEXT,
  bio_ta      TEXT,
  bio_en      TEXT,
  photo_url   TEXT,
  sort_order  INT,
  updated_at  TIMESTAMPTZ
)

-- Hero carousel slides
hero_slides (
  id          UUID PRIMARY KEY,
  type        TEXT,           -- 'image' | 'video'
  src         TEXT,
  poster      TEXT,
  alt_ta      TEXT,
  alt_en      TEXT,
  sort_order  INT,
  is_active   BOOLEAN DEFAULT true
)

-- Contact + site settings (or fold into content_blocks)
site_settings (
  id          UUID PRIMARY KEY,
  key         TEXT UNIQUE,    -- 'contact', 'seo', 'stats'
  value       JSONB,
  updated_at  TIMESTAMPTZ
)

-- Membership form submissions
join_submissions (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  village     TEXT NOT NULL,
  phone       TEXT NOT NULL,
  status      TEXT DEFAULT 'new',  -- 'new' | 'contacted' | 'archived'
  notes       TEXT,
  created_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ
)

-- Media uploads
media_files (
  id          UUID PRIMARY KEY,
  filename    TEXT,
  url         TEXT NOT NULL,
  mime_type   TEXT,
  size_bytes  INT,
  uploaded_by UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ
)
```

### Public API response shape

Single endpoint for the public site (cached):

```
GET /api/public/content
→ {
    ta: Translations,   // same shape as translations.ts today
    en: Translations,
    heroSlides: HeroSlide[],
    presidentPhoto: string,
    images: { about, join },
    gauge: { fillPercent, ticks, labelTa, labelEn }
  }
```

This keeps the public React app changes minimal: replace static `translations` import with API fetch + fallback to bundled defaults.

---

## Admin Panel — Design System (from `Admin Panel.dc.html`)

### Layout shell

| Element            | Spec                                                             |
| ------------------ | ---------------------------------------------------------------- |
| Page background    | `#F4F6F3`                                                        |
| Sidebar width      | `270px`, sticky full height                                      |
| Sidebar background | `#053524` (footer green)                                         |
| Top accent bar     | `3px` gradient gold → `#23C483` → `#066F47`                      |
| Main header        | Sticky, frosted `rgba(244,246,243,0.86)` + blur                  |
| Cards              | White `#FFFFFF`, border `#E4EDE7`, radius `16–20px`, soft shadow |

### Typography

| Role                             | Font                                      |
| -------------------------------- | ----------------------------------------- |
| Tamil headings                   | Noto Serif Tamil                          |
| Tamil body / UI                  | Anek Tamil                                |
| English subtitles, labels, stats | Cormorant Garamond (italic for subtitles) |

### Sidebar navigation (7 items)

| Route             | Tamil             | English            | Notes                             |
| ----------------- | ----------------- | ------------------ | --------------------------------- |
| `/admin`          | முகப்பு           | Dashboard          | Active: gold left bar + tinted bg |
| `/admin/members`  | உறுப்பினர்கள்     | Members            | Badge = pending count             |
| `/admin/news`     | செய்திகள்         | News               | Add button in header              |
| `/admin/leaders`  | தலைவர்கள்         | Leadership         | Phase 2                           |
| `/admin/demands`  | கோரிக்கைகள்       | Demands            | Phase 2                           |
| `/admin/water`    | நீர்மட்டம்        | Water Level        | Gauge preview + editor            |
| `/admin/settings` | தொடர்பு & அமைப்பு | Contact & Settings | Two-column form                   |

Bottom of sidebar: admin avatar initial + **நிர்வாகி / Administrator**.

### Global UI patterns

- **Top bar:** Tamil title (25px serif) + English italic subtitle; contextual search (members) and green **+ Add** button (news)
- **Modal:** Bilingual field labels (`தமிழ் · English`), cancel/save footer
- **Toast:** Dark green bottom-right, gold border, checkmark — auto-dismiss ~2.4s
- **Status badges:** Pending = gold tint `#FBF1D8`; Approved = green `#E6F6EE`

---

## Admin Panel — Pages & UX

### Layout

```
┌──────────────────────────────────────────────────┐
│  Logo   முல்லைப் பெரியாறு Admin     User ▾  Logout │
├────────────┬─────────────────────────────────────┤
│ Dashboard  │                                     │
│ News       │         Main content area           │
│ Submissions│                                     │
│ Leaders    │                                     │
│ Demands    │                                     │
│ Hero       │                                     │
│ Contact    │                                     │
│ Pages      │  (grouped section editors)          │
│ Media      │                                     │
│ Settings   │                                     │
└────────────┴─────────────────────────────────────┘
```

### Screen list

All admin routes are prefixed with **`/admin`**. UI matches the design reference screen-for-screen.

| Route             | Design view        | Purpose                                                            |
| ----------------- | ------------------ | ------------------------------------------------------------------ |
| `/admin/login`    | —                  | Split login: sidebar branding + white form card                    |
| `/admin`          | Dashboard          | 4 stat cards; recent registrations list; water widget; recent news |
| `/admin/members`  | Members            | Status filter chips; searchable table; approve action              |
| `/admin/news`     | News               | 3-column article cards; modal add/edit                             |
| `/admin/leaders`  | Leaders            | Leader cards (Phase 2 — placeholder)                               |
| `/admin/demands`  | Demands            | Numbered demand rows (Phase 2 — placeholder)                       |
| `/admin/water`    | Water Level        | Live gauge preview + numeric editor                                |
| `/admin/settings` | Contact & Settings | Contact fields + org name/tagline panels                           |

Legacy redirects: `/admin/submissions` → `/admin/members`, `/admin/contact` → `/admin/settings`.

### Bilingual editing pattern

Every content screen uses **Tamil | English tabs** (or side-by-side on desktop):

```
[ தமிழ் ] [ English ]
─────────────────────
Title:    [________________]
Body:     [________________]
          [________________]
```

Tamil is the primary language; English tab optional but encouraged for subtitles.

### UI style

- Reuse design tokens from public site (green `#067A52`, gold `#E6B130`, cream background)
- Simple, large inputs — staff may use mobile tablets
- Confirm before delete
- Toast on save success / error
- Unsaved changes warning

---

## API Endpoints

### Public (no auth)

| Method | Path                  | Description                                       |
| ------ | --------------------- | ------------------------------------------------- |
| GET    | `/api/public/content` | Full published site content                       |
| POST   | `/api/public/join`    | Submit membership form `{ name, village, phone }` |

### Admin (auth required)

| Method    | Path                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| POST      | `/api/admin/auth/login`   | Login                                |
| POST      | `/api/admin/auth/logout`  | Logout                               |
| GET       | `/api/admin/auth/me`      | Current user                         |
| GET/PUT   | `/api/admin/content/:key` | Generic section (`hero`, `about`, …) |
| CRUD      | `/api/admin/news`         | News posts                           |
| CRUD      | `/api/admin/demands`      | Demands                              |
| CRUD      | `/api/admin/leaders`      | Leaders                              |
| CRUD      | `/api/admin/hero-slides`  | Carousel                             |
| GET/PATCH | `/api/admin/submissions`  | Membership inbox                     |
| POST      | `/api/admin/media/upload` | File upload → URL                    |
| CRUD      | `/api/admin/users`        | User management (super-admin)        |

---

## Public Site Changes Required

After admin/API exist, update `mullai-periyar-sangam`:

1. Add `ContentProvider` — fetch `/api/public/content` on load
2. Replace `useLanguage()` data source: API content with **fallback** to static `translations.ts` if API fails
3. Update `Join.tsx` — `POST /api/public/join` on submit (keep success UI)
4. Update `News.tsx`, `Leaders.tsx`, etc. — read from context instead of static imports
5. Optional: SWR/React Query with 5-minute cache + revalidate on focus

**Build/deploy:** public site remains static on Amplify; only the data source changes from compile-time to runtime.

---

## Project Structure (updated)

```
mullai-periyar-sangam/
├── public/
│   └── _redirects              # SPA fallback for /admin/*
├── src/
│   ├── admin/
│   │   ├── AdminApp.tsx
│   │   ├── components/AdminLogo.tsx, AdminModal.tsx
│   │   ├── context/AuthContext.tsx, ToastContext.tsx
│   │   ├── layout/AdminLayout.tsx, pageMeta.ts
│   │   └── pages/              # Dashboard, Members, News, Water, Settings, Login
│   ├── components/             # Public site sections
│   ├── pages/PublicSite.tsx    # Former App body
│   ├── App.tsx                 # BrowserRouter: / vs /admin/*
│   └── main.tsx
└── package.json                # + react-router-dom

mullai-api/                     # Backend API
└── src/ ...
```

---

## Implementation Phases

### Phase 1 — Foundation (MVP)

- [x] Create `mullai-api` with Express + SQLite (dev; Postgres for prod)
- [x] Database seed from current `translations.ts` / `heroSlides.ts`
- [x] Auth: login, JWT, one super-admin seed user
- [x] Public API: `GET /api/public/content`, `POST /api/public/join`
- [x] Add React Router to `mullai-periyar-sangam` with `/admin/*` routes
- [x] Build `src/admin/`: login + dashboard shell + sidebar nav
- [x] Admin: **Submissions inbox**
- [x] Admin: **News** CRUD
- [x] Admin: **Contact** editor
- [x] Wire public site to API (content + join submit)
- [x] Amplify SPA redirect for `/admin/*` (`public/_redirects`)

**MVP outcome:** staff visit `yoursite.com/admin`, log in, edit news & contact, view sign-ups.

### Phase 2 — Full content management

- [ ] Leaders editor (+ photo upload)
- [ ] Demands editor (reorder)
- [ ] Hero slides manager
- [ ] Page editors: hero, about, quote, join copy, footer
- [ ] Media library (S3 uploads)
- [ ] SEO settings

### Phase 3 — Polish & ops

- [ ] User management (invite editors)
- [ ] Audit log
- [ ] CSV export for submissions
- [ ] Content preview (iframe of public site)
- [ ] Publish / draft workflow for news
- [ ] Email notification on new submission (optional)

---

## Deployment Plan

| Component              | Host                                      | URL example                                               |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Public site + admin UI | AWS Amplify (single app)                  | `www.mullaiperiyar.org` and `www.mullaiperiyar.org/admin` |
| API                    | Render, Railway, or local                 | `api.mullaiperiyar.org`                                   |
| Database               | SQLite (local dev) / Neon Postgres (prod) | Connection string in env                                  |
| Media                  | AWS S3 bucket (Phase 2)                   | CDN URL in env                                            |

### Environment variables

**API (`mullai-api/.env`)**

```
PORT=3001
JWT_SECRET=
ADMIN_INITIAL_EMAIL=admin@mullaiperiyar.org
ADMIN_INITIAL_PASSWORD=
CORS_ORIGINS=https://main.d2v1j3kfrcng37.amplifyapp.com,http://localhost:5173
```

**Website (`mullai-periyar-sangam/.env`)**

```
VITE_API_URL=http://localhost:3001
```

---

## Seed Data

On first deploy, run a seed script that copies current static content into the database:

- Source: `mullai-periyar-sangam/src/i18n/translations.ts`
- Source: `mullai-periyar-sangam/src/data/content.ts`
- Source: `mullai-periyar-sangam/src/data/heroSlides.ts`

Default admin user (change password on first login):

```
email: admin@mullaiperiyar.org
password: (set via env ADMIN_INITIAL_PASSWORD)
```

---

## Out of Scope (v1)

- Multi-tenant / multiple associations
- Full WYSIWYG page builder
- Public member login portal
- SMS/WhatsApp integration for submissions
- Tamil spell-check
- Mobile native admin app
- Version history / rollback (P3)

---

## Success Criteria

- [ ] Staff can log in securely
- [ ] New membership submissions appear in admin within seconds
- [ ] News article edited in admin appears on public site without code change
- [ ] Contact phone/email/address updates reflect on live site
- [ ] Tamil and English content editable separately
- [ ] Public site still works if API is temporarily down (static fallback)
- [ ] Admin not discoverable or indexable by search engines (`noindex`, no public links)

---

## Next Step

After this plan is approved, implementation starts with **Phase 1**:

1. Scaffold `mullai-api` + Neon schema + seed
2. Scaffold `mullai-admin` with login and dashboard
3. Connect public site Join form and content fetch

Estimated order of work: **API → Admin shell → Submissions + News → Public site integration → remaining editors**.
