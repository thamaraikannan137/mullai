import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // Amplify SSR compute does not always inject env vars at Lambda runtime;
  // embed server secrets from the build environment instead.
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL,
    ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
  },
}

export default nextConfig
