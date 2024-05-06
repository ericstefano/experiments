import { drizzle } from 'drizzle-orm/d1'
import type { H3Event } from 'h3'
import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDB(event : H3Event) {
  return drizzle(event.context.cloudflare.env.DB, { schema })
}

// export function useDB() {
//   return drizzle(hubDatabase(), { schema })
// }
