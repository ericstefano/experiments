import { Lucia, TimeSpan } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'

function createLucia(event: H3Event) {
  const adapter = new D1Adapter(event.context.cloudflare.env.DB, {
    user: 'user',
    session: 'session',
  })

  return new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(2, 'w'),
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes(attributes) {
      return {
        emailVerified: Boolean(attributes.email_verified),
        email: attributes.email,
        fullname: attributes.fullname
      }
    },
  })
}

export function useLucia(event: H3Event) {
  if (!!event.context.lucia) return event.context.lucia;
  const lucia = createLucia(event);
  event.context.lucia = lucia
  return lucia
}

interface DatabaseUserAttributes {
  email: string
  email_verified: boolean
  fullname: string
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof useLucia>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

declare module 'h3' {
  interface H3EventContext {
    lucia: ReturnType<typeof createLucia>
  }
}
