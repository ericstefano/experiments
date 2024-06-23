import type { Cookie, Session, User } from 'lucia'
import { createError } from 'h3'

export async function useAuth(event: H3Event) {
  const lucia = useLucia(event)
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
  if (!sessionId)
    throw createError({ status: 401 })

  const { session, user } = await lucia.validateSession(sessionId)
  if (!user)
    throw createError({ status: 401 })

  const sessionCookie = session && session.fresh ? lucia.createSessionCookie(session.id) : lucia.createBlankSessionCookie()
  appendHeader(
    event,
    'Set-Cookie',
    sessionCookie.serialize(),
  )

  event.context.sessionCookie = sessionCookie
  event.context.session = session
  event.context.user = user

  return { user, session, sessionCookie }
}

declare module 'h3' {
  interface H3EventContext {
    sessionCookie: Cookie
    session: Session
    user: User
  }
}
