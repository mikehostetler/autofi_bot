import { Database } from 'bun:sqlite'
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

let db: BunSQLiteDatabase<typeof schema> | null = null
let sqlite: Database | null = null

export function getDb(): BunSQLiteDatabase<typeof schema> {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}

export function initDb(
  dbPath: string = './data/bot.sqlite'
): BunSQLiteDatabase<typeof schema> {
  if (db) return db

  // Ensure data directory exists
  const dir = dbPath.substring(0, dbPath.lastIndexOf('/'))
  if (dir) {
    try {
      Bun.spawnSync(['mkdir', '-p', dir])
    } catch {
      // Directory might already exist
    }
  }

  sqlite = new Database(dbPath)
  sqlite.exec('PRAGMA journal_mode = WAL')
  sqlite.exec('PRAGMA busy_timeout = 5000')

  db = drizzle(sqlite, { schema })
  return db
}

export function closeDb(): void {
  if (sqlite) {
    sqlite.close()
    sqlite = null
    db = null
  }
}
