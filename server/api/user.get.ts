export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth, useDatabase],
  async handler(event) {
    const { user } = event.context
    return {
      fullname: user.fullname,
      email: user.email,
      emailVerified: user.emailVerified,
      id: user.id
    }
  },
})
