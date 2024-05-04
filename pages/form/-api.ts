export async function validatePhoneNumber(number: string) {
  return $fetch('/api/phone', {
    method: 'POST',
    body: {
      number,
    },
  })
}
