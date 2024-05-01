import consola from 'consola'

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event)
  multipart?.forEach((part) => {
    console.log(part)
  })
})
