import { Database } from 'bun:sqlite'

const DB_PATH = process.env.DB_PATH || './data/bot.sqlite'

// Ensure data directory exists
const dir = DB_PATH.substring(0, DB_PATH.lastIndexOf('/'))
if (dir) {
  Bun.spawnSync(['mkdir', '-p', dir])
}

const db = new Database(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')

// Migration SQL
const migrations = [
  `CREATE TABLE IF NOT EXISTS bot_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signature TEXT NOT NULL UNIQUE,
    slot INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    error TEXT,
    tx_type TEXT,
    data TEXT,
    created_at INTEGER,
    confirmed_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    message TEXT,
    data TEXT,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS token_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mint TEXT NOT NULL,
    ata TEXT NOT NULL,
    owner TEXT NOT NULL,
    balance REAL DEFAULT 0,
    decimals INTEGER DEFAULT 9,
    last_updated_slot INTEGER,
    created_at INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_signature ON transactions(signature)`,
  `CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type)`,
  `CREATE INDEX IF NOT EXISTS idx_token_accounts_mint ON token_accounts(mint)`,
  `CREATE INDEX IF NOT EXISTS idx_token_accounts_owner ON token_accounts(owner)`,
]

console.log('Running migrations...')

for (const sql of migrations) {
  db.exec(sql)
}

console.log('Migrations complete!')
db.close()
