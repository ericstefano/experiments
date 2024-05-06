import { defineConfig } from 'drizzle-kit'

const { LOCAL_DB_PATH } = process.env;

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: LOCAL_DB_PATH,
  }
})