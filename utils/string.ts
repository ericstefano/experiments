export function getFileExtension(fileName: string) {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export function sanitizePhoneNumber(number: string) {
  return number.replaceAll(/\D+/g, '')
}
