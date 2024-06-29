// 1) Verifies if the session cookie exists in the request headers, if not it returns 401.
// 2) Verifies if the user exists for this session, if not it returns 401.
// 3) Verifies if the session exists, if not, it sets a blank session cookie in the request headers.
// 4) Verifies if the session exists and it's fresh, if it is, then it creates a new session and append it in the request headers.
// 5) Deletes other verification codes in the email verification table
// 6) Generates a new verificationCOde
// 7) Saves the verificationCode in the table
// 8) Send email with code

export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth],
  async handler(event) {
    const { user } = event.context
    return useSendEmailVerificationCode(event, { userId: user.id, email: user.email })
  },
})
