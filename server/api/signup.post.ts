import { Buffer } from 'node:buffer'
import * as v from 'valibot'
import parsePhoneNumber from 'libphonenumber-js/mobile'
import { TimeSpan, createDate } from 'oslo'
import { getUnixTime } from 'date-fns'
import { createError } from 'h3'
import { generateIdFromEntropySize } from 'lucia'
import { emailSchema, fullnameSchema, passwordSchema, shiftSchema, termsSchema, ufSchema } from '~/pages/signup/-schema'
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE } from '~/constants'

export default defineEventHandler({
  onRequest: [usePreventCsrf, useLucia, useDatabase],
  async handler(event) {
    const multipart = await readMultipartFormData(event)
    if (!multipart) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: `The request Content-Type must be 'multipart/form-data', but it was received as '${getRequestHeader(event, 'Content-Type')}'`,
      })
    }

    const object: Record<string, unknown> = {}

    for (const part of multipart) {
      if (!part.name)
        return
      if (part.filename) {
        const { name: key, filename: name, ...rest } = part
        object[key] = { name, size: rest.data.length, ...rest }
      }
      else { object[part.name] = part.data.toString() }
    }

    const imageSchema = v.object({
      name: v.string(),
      data: v.instance(Buffer),
      size: v.number([v.maxValue(MAX_IMAGE_FILE_SIZE)]),
      type: v.picklist(ACCEPTED_IMAGE_MIME_TYPES),
    })

    const phoneSchema = v
      .string([v.toCustom(sanitizePhoneNumber), v.custom(number => !!parsePhoneNumber(number, 'BR')?.isValid())])

    const fields = {
      fullname: fullnameSchema,
      email: emailSchema,
      phone: phoneSchema,
      password: passwordSchema,
      image: imageSchema,
      terms: v.coerce(termsSchema, Boolean),
      shift: shiftSchema,
      uf: ufSchema,
    }

    const schema = v.object(fields)

    const parsed = v.safeParse(schema, object)

    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: Object.entries(v.flatten(parsed.issues).nested).map(([key, value]) => `${key}: ${value?.join(',')}`).at(0),
      })
    }

    const { db, lucia } = event.context

    const scrypt = useScrypt()
    const hashedPassword = await scrypt.hash(parsed.output.password)
    const userId = generateIdFromEntropySize(10)

    try {
      await db.insert(tables.userTable).values({
        id: userId,
        email: parsed.output.email,
        fullname: parsed.output.fullname,
        hashedPassword,
        phone: parsed.output.phone,
        uf: parsed.output.uf,
        shift: parsed.output.shift,
        terms: parsed.output.terms,
        emailVerified: false,
      })
    }
    catch(error) { throw createError({ statusCode: 400 }) }

    const { sessionCookie } = await useCreateSession(event, { userId })

    appendHeader(
      event,
      'Set-Cookie',
      sessionCookie.serialize(),
    )
    
    const verificationData = await useSendEmailVerificationCode(event, { userId, email: parsed.output.email })
    return {
      code: verificationData.verificationCode, //temp, remove after sending email
      id: userId,
      email: parsed.output.email,
      fullname: parsed.output.fullname,
      emailVerified: false,
    }
  },
})
