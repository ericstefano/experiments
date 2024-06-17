import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  fullname: text('fullname'),
  phone: text('phone'),
  email: text('email'),
  terms: integer('terms', { mode: 'boolean' }),
  shift: text('shift', { enum: ['morning', 'afternoon', 'evening'] }),
  uf: text('uf', {
    enum: [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ],
  }),
  hashedPassword: text('hashed_password'),
  emailVerified: integer('email_verified', { mode: 'boolean' }),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
})

export const emailVerificationTable = sqliteTable('email_verification', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' }),
  code: text('code'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
})
