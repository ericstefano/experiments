import * as v from 'valibot'

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  if (!multipart)
    return

  const object: Record<string, any> = {}

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

  const schema = v.object({
    fullname: v.string(),
  })

  console.log(object, v.safeParse(schema, object))
})
