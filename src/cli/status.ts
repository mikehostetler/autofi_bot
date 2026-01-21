import { Command } from 'commander'
import { initDb, getDb } from '../db'
import { transactions, events } from '../db/schema'
import { getConnection } from '../solana'
import { count, eq } from 'drizzle-orm'

export const statusCommand = new Command('status')
  .description('Show bot status and statistics')
  .action(handleStatusCommand)

async function handleStatusCommand() {
  // Initialize
  initDb()
  const db = getDb()
  const connection = getConnection()

  // Get Solana status
  const slot = await connection.getSlot()
  const blockTime = await connection.getBlockTime(slot)

  // Get transaction counts
  const [pending] = await db
    .select({ count: count() })
    .from(transactions)
    .where(eq(transactions.status, 'pending'))

  const [confirmed] = await db
    .select({ count: count() })
    .from(transactions)
    .where(eq(transactions.status, 'confirmed'))

  const [failed] = await db
    .select({ count: count() })
    .from(transactions)
    .where(eq(transactions.status, 'failed'))

  const [totalEvents] = await db.select({ count: count() }).from(events)

  console.log('\n📊 Bot Status\n')
  console.log('Solana Network:')
  console.log(`  Current Slot: ${slot}`)
  console.log(`  Block Time: ${blockTime ? new Date(blockTime * 1000).toISOString() : 'N/A'}`)
  console.log('\nTransactions:')
  console.log(`  Pending: ${pending.count}`)
  console.log(`  Confirmed: ${confirmed.count}`)
  console.log(`  Failed: ${failed.count}`)
  console.log(`\nTotal Events: ${totalEvents.count}`)
  console.log('')
}
