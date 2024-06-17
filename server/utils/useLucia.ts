import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'

export function useLucia(event: H3Event) {
  const adapter = new D1Adapter(event.context.cloudflare.env.DB, {
    user: 'user',
    session: 'session',
  })

  const lucia = new Lucia(adapter, {
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
    lucia: ReturnType<typeof useLucia>
  }
}
