import { eq } from "drizzle-orm";
import { isWithinExpirationDate } from "oslo";
import { createError } from 'h3'

export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth, useDatabase, useLucia],
  async handler(event) {
    const { code } = await readBody(event);
    if (!code) throw createError({ status: 400 })
    const { db, lucia, user } = event.context;
    const verification = await db.query.emailVerificationTable.findFirst({
      where: eq(tables.emailVerificationTable.userId, user.id)
    })
    if (!verification) throw createError({ status: 422 })
    if (verification.code !== code) throw createError({ status: 422 });
    if (!isWithinExpirationDate(verification.expiresAt)) throw createError({ status: 422 })
    await db.delete(tables.emailVerificationTable).where(eq(tables.emailVerificationTable.userId, verification.userId))
    await lucia.invalidateSession(user.id)
    await db.update(tables.userTable).set({
      emailVerified: true
    }).where(eq(tables.userTable.id, user.id))
  }
})