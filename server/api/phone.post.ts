import parsePhoneNumber from 'libphonenumber-js/mobile'

export default defineEventHandler(async (event) => {
  const { number } = await readBody(event)
  const parsed = parsePhoneNumber(number, 'BR')
  return { valid: parsed && parsed.isValid() }
})
