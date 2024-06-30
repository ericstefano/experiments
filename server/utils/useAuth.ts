import type { Cookie, Session, User } from 'lucia'
import { createError } from 'h3'

export async function useAuth(event: H3Event) {
  const lucia = useLucia(event)
  const sessionId = getCookie(event, lucia.sessionCookieName)
  if (!sessionId)
    throw createError({ status: 401 })

  const { session, user } = await lucia.validateSession(sessionId)
  if (!user || !session) // maybe this verification shouldn't be done (?), check Lucia docs...
    throw createError({ status: 401 })

  if (session && session.fresh) {
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
  }

  if (!session) {
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize(),
    )
  }

  event.context.session = session
  event.context.user = user

  return { user, session }
}

declare module 'h3' {
  interface H3EventContext {
    sessionCookie: Cookie
    session: Session
    user: User
  }
}
