import { Command } from 'commander'
import log from '../util/log'
import { initDb, closeDb } from '../db'
import { getConnection } from '../solana'

export const helloBotCommand = new Command('hello-bot')
  .description('Example bot that logs periodic messages')
  .option('-i, --interval <ms>', 'Tick interval in milliseconds', '5000')
  .action(handleHelloBotCommand)

async function* createTickGenerator(intervalMs: number): AsyncGenerator<number, never, unknown> {
  let tick = 0
  while (true) {
    yield tick++
    await Bun.sleep(intervalMs)
  }
}

async function handleHelloBotCommand(options: { interval: string }) {
  const intervalMs = parseInt(options.interval, 10)

  log.info({ intervalMs }, 'Starting Hello Bot')

  // Initialize database
  initDb()

  // Verify Solana connection
  const connection = getConnection()
  const slot = await connection.getSlot()
  log.info({ slot }, 'Connected to Solana')

  // Setup graceful shutdown
  const shutdown = () => {
    log.info('Shutting down...')
    closeDb()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  // Main loop using generator
  for await (const tick of createTickGenerator(intervalMs)) {
    log.info({ tick, timestamp: new Date().toISOString() }, 'Hello from bot')

    // Example: fetch current slot each tick
    const currentSlot = await connection.getSlot()
    log.debug({ tick, slot: currentSlot }, 'Current slot')
  }
}
