export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth, useLucia],
  async handler(event) {
    const { lucia, session } = event.context
    await lucia.invalidateSession(session.id)
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize(),
    )
  },
})
