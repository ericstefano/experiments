interface CreateSessionParams {
  userId: string
}

export async function useCreateSession(event: H3Event, params: CreateSessionParams) {
  const lucia = useLucia(event);
  const session = await lucia.createSession(params.userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  return {session, sessionCookie}
}