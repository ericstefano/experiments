import { drizzle } from 'drizzle-orm/d1'
import type { H3Event } from 'h3'
import { customAlphabet as nanoIdFactory } from 'nanoid'
import * as schema from '../database/schema'

const NANO_ID_SIZE = 12
const NANO_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const generateId = nanoIdFactory(NANO_ID_ALPHABET)

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDB(event: H3Event) {
  return drizzle(event.context.cloudflare.env.DB, { schema })
}

export function nanoid() {
  return generateId(NANO_ID_SIZE)
}

// export function useDB() {
//   return drizzle(hubDatabase(), { schema })
// }
