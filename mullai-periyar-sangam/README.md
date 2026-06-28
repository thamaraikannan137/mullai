# Mullai Periyar Sangam

Next.js app for the public website, admin panel, and API.

## Local development

```bash
cd mullai-periyar-sangam
cp .env.example .env.local
# Add your Neon DATABASE_URL to .env.local
npm install
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Export seed data and build for production |
| `npm run start` | Run production build locally |
| `npm run seed` | Seed or reset the database manually |

## Deploy

Deployed via AWS Amplify from the repo root (`amplify.yml`, app root `mullai-periyar-sangam`).

Required env vars: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`.
