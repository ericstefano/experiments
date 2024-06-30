import { generateIdFromEntropySize } from 'lucia'
import { TimeSpan, createDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'
import { eq } from 'drizzle-orm'

export async function useSendEmailVerificationCode(event: H3Event, { userId, email }: { userId: string, email: string }) {
  const db = useDatabase(event)
  try {
    await db.delete(tables.emailVerificationTable).where(eq(tables.emailVerificationTable.userId, userId))
  } catch {}
  const verificationCode = generateRandomString(6, alphabet('0-9'))
  await db.insert(tables.emailVerificationTable).values({
    id: generateIdFromEntropySize(10),
    userId,
    code: verificationCode,
    expiresAt: createDate(new TimeSpan(15, 'm')),
  })
  // await sendEmail({ email, code: verificationCode })
  return { email, verificationCode }
}
