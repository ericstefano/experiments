import { verifyRequestOrigin } from 'lucia'
import { createError } from 'h3'

export function usePreventCsrf(event: H3Event) {
  // H3 doesn't recommend using the middleware pattern
  // https://h3.unjs.io/guide/event-handler#middleware
  // It suggest's using composables (utils) + object syntax with handlers like this
  // Cross Site Request Forgery Prevention
  if (!isMethod(event, 'GET')) {
    const originHeader = getHeader(event, 'Origin') || null
    const hostHeader = getHeader(event, 'Host') || null
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader]))
      throw createError({ status: 403 })
  }
}
