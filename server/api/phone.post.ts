import type { H3Event } from 'h3'
import parsePhoneNumber from 'libphonenumber-js/mobile'

export const cachedPhoneNumber = defineCachedFunction(async (event: H3Event, number: string) => {
  const parsed = parsePhoneNumber(number, 'BR')
  return { valid: parsed && parsed.isValid() }
}, {
  maxAge: 60 * 60,
  name: 'phoneNumber',
  getKey(event: H3Event, number: string) { return number },
})

export default defineEventHandler({
  onRequest: [usePreventCsrf],
  async handler(event) {
    const { number } = await readBody(event)
    const parsed = await cachedPhoneNumber(event, number)
    return { valid: parsed.valid }
  },
})
