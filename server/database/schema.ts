import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  fullname: text('fullname'),
  phone: text('phone'),
  email: text('email').unique(),
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
  hashedPassword: text('hashedPassword').notNull(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }),
})

export const emailVerificationTable = sqliteTable('emailVerification', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .references(() => userTable.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
})
