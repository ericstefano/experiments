import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  fullname: text('fullname').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  terms: integer('terms', { mode: 'boolean' }).notNull(),
  shift: text('shift', { enum: ['morning', 'afternoon', 'evening'] }).notNull(),
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
  }).notNull(),
  password: text('hashed_password').notNull(),
})

// export const session = sqliteTable('session', {
//   id: text('id').primaryKey(),
//   expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
// })

// export const oauth_account = sqliteTable('oauth_account', {
//   providerId: text('provider_id').notNull(),
//   providerUserId: text('provider_user_id').notNull(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
// })
