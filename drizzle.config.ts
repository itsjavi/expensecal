import "@/env/load"

import { defineConfig } from 'drizzle-kit'

if (!process.env['DATABASE_URL']) {
  throw new Error('DATABASE_URL env var is required')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env['DATABASE_URL'],
  },
})
