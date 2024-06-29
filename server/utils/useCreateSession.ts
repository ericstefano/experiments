import { getUnixTime } from "date-fns";

interface CreateSessionParams {
  expires_at: Date,
  userId: string
}

export async function useCreateSession(event: H3Event, params: CreateSessionParams) {
  const lucia = useLucia(event);
  const session = await lucia.createSession(params.userId, {
    expires_at: getUnixTime(params['expires_at']),
  })
  const sessionCookie = lucia.createSessionCookie(session.id)

  return {session, sessionCookie}
}