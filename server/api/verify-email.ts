import { eq } from "drizzle-orm";
import { isWithinExpirationDate } from "oslo";
export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth, useDrizzleDb, useLucia],
  async handler(event) {
    const {code} = await readBody(event);
    if (!code) throw createError({ status: 400 })
    const {db, lucia, user} = event.context;
    const verification = await db.query.emailVerificationTable.findFirst({
      where: eq(tables.emailVerificationTable.userId,  user.id)
    })
    if (!verification) throw createError({ status: 400 })
    if (verification.code !== code) throw createError({ status: 400 });
    if (!isWithinExpirationDate(verification.expiresAt)) throw createError({ status: 400 })
    return true;
    // await db.delete(tables.emailVerificationTable).where(eq(tables.userTable.id, user.id))
    // await lucia.invalidateSession(user.id)
    // await db.update(tables.userTable).set({
    //   emailVerified: true
    // }).where(eq(tables.userTable.id, user.id))
  }
 })