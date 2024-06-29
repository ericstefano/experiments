import { eq } from "drizzle-orm";
import * as v from 'valibot';
import { TimeSpan, createDate } from 'oslo'
export default defineEventHandler({
  onRequest: [usePreventCsrf, useDatabase],
  async handler(event) {
    const body = await readBody(event);
    if (!body) throw createError({ statusCode: 400 })
    const fields = {
      email: v.string([v.email()]),
      password: v.string([v.minLength(8)]),
    }
    const schema = v.object(fields)
    const parsed = v.safeParse(schema, body)
    if (!parsed.success) throw createError({ statusCode: 400 })
    const { db } = event.context;
    const user = await db.query.userTable.findFirst({ where: eq(tables.userTable.email, parsed.output.email) })
    if (!user) throw createError({ statusCode: 400 });
    const scrypt = useScrypt();
    const isValid = await scrypt.verify(user.hashedPassword, parsed.output.password);
    if (!isValid) throw createError({ statusCode: 400 })
    const { sessionCookie } = await useCreateSession(event, { userId: user.id, expires_at: createDate(new TimeSpan(15, 'd')) })
    appendHeader(
      event,
      'Set-Cookie',
      sessionCookie.serialize(),
    )
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      emailVerified: user.emailVerified,
    }
  },
})
