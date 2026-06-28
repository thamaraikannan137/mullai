#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOSTING="$ROOT/.amplify-hosting"
FRONTEND="$ROOT/mullai-periyar-sangam"
API="$ROOT/mullai-api"

echo "==> Installing frontend dependencies"
cd "$FRONTEND"
npm install

echo "==> Installing API dependencies"
cd "$API"
npm install

echo "==> Migrating and seeding Neon database"
cd "$API"
npx tsx src/seed.ts

echo "==> Building API"
npm run build

echo "==> Building frontend (same-origin API)"
cd "$FRONTEND"
VITE_API_URL= npm run build

echo "==> Assembling Amplify hosting bundle"
rm -rf "$HOSTING"
mkdir -p "$HOSTING/compute/default" "$HOSTING/static"

cp -R "$FRONTEND/dist/." "$HOSTING/static/"
cp "$ROOT/deploy-manifest.json" "$HOSTING/deploy-manifest.json"
cp -R "$API/dist/." "$HOSTING/compute/default/"
cp -R "$API/node_modules" "$HOSTING/compute/default/node_modules"
cp "$API/package.json" "$HOSTING/compute/default/package.json"
(cd "$HOSTING/compute/default" && npm prune --omit=dev)

echo "==> Amplify bundle ready at .amplify-hosting"
