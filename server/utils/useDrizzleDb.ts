import { drizzle } from 'drizzle-orm/d1'

export function useDrizzleDb(event: H3Event) {
  const drizzleDb = drizzle(event.context.cloudflare.env.DB, { schema: tables })
  event.context.db = drizzleDb
  return drizzleDb
}

declare module 'h3' {
  interface H3EventContext {
    db: ReturnType<typeof useDrizzleDb>
  }
}
