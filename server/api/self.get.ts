import { eq } from "drizzle-orm";

export default defineEventHandler({
  onRequest: [usePreventCsrf, useAuth, useDatabase],
  async handler(event) {
    const { user, db } = event.context
    const userData = await db.query.userTable.findFirst({
      where: eq(tables.userTable.id, user.id)
    })
    return {
      fullname: userData?.fullname,
      email: userData?.email,
      emailVerified: userData?.emailVerified,
      id: userData?.id
    }
  },
})
