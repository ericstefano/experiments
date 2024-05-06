import { Buffer } from 'node:buffer'
import * as v from 'valibot'
import parsePhoneNumber from 'libphonenumber-js/mobile'
import fsLiteDriver from 'unstorage/drivers/fs-lite'; import { createStorage } from 'unstorage'
import sharp from 'sharp'
import { emailSchema, fullnameSchema, passwordSchema, shiftSchema, termsSchema, ufSchema } from '~/pages/form/-schema'
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE } from '~/constants'

const storage = createStorage({
  driver: fsLiteDriver({ base: './.nuxt/tmp' }),
})

const assets = createStorage({
  driver: fsLiteDriver({ base: './assets' }),
})

export default defineEventHandler(async (event) => {
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

  const sharpStream = sharp(parsed.output.image.data)
  const metadata = await sharpStream.metadata()
  let toAvif = sharpStream.toFormat('avif', { effort: 0, quality: 45 }).withMetadata()
  if (metadata.orientation)
    toAvif = toAvif.rotate()
  const toBuffer = await toAvif.composite([
    { input: await assets.getItemRaw('/images/watermark.png'), blend: 'atop', gravity: 'centre' },
    { input: await assets.getItemRaw('/images/watermark.png'), blend: 'exclusion', left: 800, top: 1160 },
  ])
    .resize({ width: 1024 }).toBuffer()
  storage.setItemRaw('to0.avif', toBuffer)
  await useDB().insert(tables.user).values({
    id: Math.round(Math.random() * 100000),
    email: parsed.output.email,
    fullname: parsed.output.fullname,
    password: parsed.output.password,
    phone: parsed.output.phone,
    uf: parsed.output.uf,
    shift: parsed.output.shift,
    terms: parsed.output.terms,
  })
  return {
    ...parsed.output,
    image: undefined,
  }
})
