import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'

function createLucia(event: H3Event) {
  const adapter = new D1Adapter(event.context.cloudflare.env.DB, {
    user: 'user',
    session: 'session',
  })

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes(attributes) {
      return {
        emailVerified: attributes.emailVerified,
        email: attributes.email,
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
  emailVerified: boolean
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
