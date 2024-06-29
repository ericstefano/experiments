import { drizzle } from 'drizzle-orm/d1'

function createDrizzleDb(event: H3Event) {
  return drizzle(event.context.cloudflare.env.DB, { schema: tables })
}

export function useDatabase(event: H3Event) {
  if (!!event.context.db) return event.context.db;
  const drizzleDb = createDrizzleDb(event)
  event.context.db = drizzleDb
  return drizzleDb
}

declare module 'h3' {
  interface H3EventContext {
    db: ReturnType<typeof createDrizzleDb>
  }
}
