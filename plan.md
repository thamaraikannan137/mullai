# முல்லைப் பெரியாறு சங்கம் — React Website Plan

## Overview

Build a single-page React website for **முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம்** (Mullai Periyar Single-Crop Irrigation Farmers' Association), faithfully translating the Claude design reference in `முல்லைப் பெரியாறு சங்கம் வெபsite (3)/Mullai Periyar Sangam.dc.html`.

The site is a Tamil-first advocacy and membership portal for farmers in five irrigation districts (தேனி, மதுரை, சிவகங்கை, ராமநாதபுரம், திண்டுக்கல்), centered on the 152-foot water-level demand for the Mullaperiyar dam.

---

## Design Reference

| Asset | Purpose |
|-------|---------|
| `Mullai Periyar Sangam.dc.html` | Full page layout, content, colors, typography |
| `screenshots/banner.png` | Hero section visual reference |
| `screenshots/contact.png` | Contact section reference |
| `screenshots/contact-footer.png` | Footer reference |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **React 18+** with **Vite** | Fast dev, modern tooling |
| Language | **TypeScript** | Type-safe content/data models |
| Styling | **Tailwind CSS v4** | Utility classes map cleanly from inline design styles |
| Fonts | Google Fonts via `@fontsource` or CDN | Noto Serif Tamil, Anek Tamil, Cormorant Garamond |
| Routing | None (anchor scroll SPA) | Design is single-page with `#section` nav |
| State | React `useState` | Membership form only |
| Icons | Inline SVG (from design) | Matches original exactly |

---

## Design Tokens

### Colors

```
--bg-cream:      #F6F2E8
--bg-white:      #FBFCFA
--green-dark:    #064E3B
--green-mid:     #067A52
--green-light:   #0E9F6E / #23C483
--green-pale:    #E6F6EE
--gold:          #E6B130
--gold-dark:     #BC8E1C
--gold-pale:     #F3E3B3
--text-dark:     #15241D / #064E3B
--text-body:     #3C4A42
--text-muted:    #5A6B61 / #7C8A81
--footer-bg:     #053524
```

### Typography

| Role | Font | Usage |
|------|------|-------|
| Tamil headings | Noto Serif Tamil | h1, h2, h3, Tamil body |
| Tamil body | Anek Tamil | Paragraphs, nav, labels |
| English accent | Cormorant Garamond | Section numbers, stats, quotes, subtitles |

### Layout

- Max content width: **1240px**
- Section padding: **32px** horizontal, **~118–122px** vertical
- Fixed header height: **80px**
- Scroll margin for anchors: **88px**

---

## Page Sections (Component Map)

```
App
├── Header          — fixed nav, logo SVG, 6 links + CTA
├── Hero            — full-viewport banner, water-level gauge, stats strip
├── About           — two-column: text + image, 1895 badge
├── QuoteBand       — full-width green gradient quote
├── Leaders         — president feature + 3 office bearer cards
├── Demands         — sticky sidebar + 5 demand cards
├── News            — 3 news/announcement cards
├── Join            — split panel: info + membership form
├── Contact         — map placeholder + contact rows
└── Footer          — 3-column links, districts, copyright
```

---

## Data Models (`src/data/content.ts`)

```ts
NavItem       { ta, href }
GaugeTick     { label, pos, len }
Stat          { value, ta }
Leader        { name, role_ta, role_en, photo?, initial? }
Demand        { num, ta, en }
NewsItem      { tag, date, ta, body, img }
ContactItem   { label, value, icon }
```

All content extracted from the design's `renderVals()` block — Tamil text preserved exactly.

---

## Project Structure

```
mullai-periyar-sangam/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # local images (optional overrides)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── QuoteBand.tsx
│   │   │   ├── Leaders.tsx
│   │   │   ├── Demands.tsx
│   │   │   ├── News.tsx
│   │   │   ├── Join.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── Logo.tsx
│   │       ├── SectionLabel.tsx
│   │       ├── WaterGauge.tsx
│   │       └── ImageSlot.tsx
│   ├── data/
│   │   └── content.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Tailwind + font imports + global styles
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Implementation Phases

### Phase 1 — Scaffold
- [x] Create Vite + React + TypeScript project
- [x] Install and configure Tailwind CSS
- [x] Add Google Fonts
- [x] Set up `content.ts` with all static data

### Phase 2 — Layout & Global
- [x] `Logo` SVG component (header + footer variants)
- [x] `Header` — fixed, glassmorphism, smooth scroll links
- [x] `Footer` — gradient top bar, 3 columns
- [x] Global CSS: smooth scroll, selection color, animations (`mpRise`, `mpCue`)

### Phase 3 — Sections (top to bottom)
- [x] `Hero` — background image, gradient overlays, water gauge, 4-stat glass strip
- [x] `About` — grid layout, floating 1895 badge
- [x] `QuoteBand` — centered Tamil/English quote
- [x] `Leaders` — president card + bearer grid
- [x] `Demands` — sticky left column, numbered cards
- [x] `News` — 3-column card grid on green gradient
- [x] `Join` — form with name/village/phone + success state
- [x] `Contact` — office hours + phone/email/address rows

### Phase 4 — Polish
- [x] Hover transitions on cards, nav, buttons
- [x] Responsive breakpoints (mobile nav, stacked grids)
- [x] Image fallbacks / loading states
- [ ] Accessibility: semantic HTML, aria labels, focus styles (partial)

---

## Responsive Strategy

| Breakpoint | Changes |
|------------|---------|
| `< 768px` | Single-column grids; hide water gauge; hamburger nav |
| `768–1024px` | 2-column news; stacked about/leaders |
| `> 1024px` | Full design as reference |

---

## Images (from design)

| Slot | Source URL |
|------|-----------|
| Hero banner | Wikimedia Mullaperiyar View |
| About | Paddy field in Theni district |
| President | Placeholder (paddy field) |
| Join bg | Mullapperiyardam |
| News cards | Mix of dam + paddy images |

---

## Form Behavior (Join section)

1. Fields: name, village, phone (all required)
2. On submit → show success message with user's name
3. No backend in v1 — client-side only (matches design prototype)

---

## Out of Scope (v1)

- CMS / admin panel
- Backend API for membership
- Multi-language toggle (Tamil primary, English subtitles inline)
- Blog pagination
- Authentication

---

## Success Criteria

- [x] Visual match to design screenshots (banner, contact, footer)
- [x] All 8 sections render with correct Tamil content
- [x] Smooth anchor navigation from header/footer
- [x] Membership form works with success state
- [x] Runs with `npm run dev` on localhost
- [x] Production build passes `npm run build`
