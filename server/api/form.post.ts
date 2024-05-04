import * as v from 'valibot'

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
      object[part.name] = {
        name: part.filename,
        type: part.type,
        size: part.data.length,
      }
    }
    else {
      object[part.name] = part.data.toString()
    }
  }

  // const parsed = v.safeParse(schema, object)

  // console.log(object, parsed, getFileExtension(object.image.name))
})
