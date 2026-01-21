import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const botState = sqliteTable('bot_state', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
})

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  signature: text('signature').notNull().unique(),
  slot: integer('slot'),
  status: text('status').notNull().default('pending'), // pending, confirmed, failed
  error: text('error'),
  txType: text('tx_type'), // swap, transfer, etc.
  data: text('data'), // JSON blob for tx-specific data
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
  confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
})

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventType: text('event_type').notNull(),
  severity: text('severity').notNull().default('info'), // debug, info, warn, error
  message: text('message'),
  data: text('data'), // JSON blob
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
})

export const tokenAccounts = sqliteTable('token_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mint: text('mint').notNull(),
  ata: text('ata').notNull(),
  owner: text('owner').notNull(),
  balance: real('balance').default(0),
  decimals: integer('decimals').default(9),
  lastUpdatedSlot: integer('last_updated_slot'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
})
