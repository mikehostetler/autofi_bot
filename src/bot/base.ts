import { Connection, Keypair } from '@solana/web3.js'
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import log from '../util/log'
import * as schema from '../db/schema'

export interface BotContext {
  connection: Connection
  wallet: Keypair
  db: BunSQLiteDatabase<typeof schema>
  tick: number
}

export interface BotConfig {
  tickIntervalMs: number
  name: string
}

export abstract class BaseBot {
  protected config: BotConfig
  protected running = false

  constructor(config: BotConfig) {
    this.config = config
  }

  abstract onTick(ctx: BotContext): Promise<void>

  async onInit?(ctx: Omit<BotContext, 'tick'>): Promise<void>
  async onShutdown?(): Promise<void>

  protected async *tickGenerator(): AsyncGenerator<number, never, unknown> {
    let tick = 0
    while (this.running) {
      yield tick++
      await Bun.sleep(this.config.tickIntervalMs)
    }
    // This satisfies the 'never' return type requirement
    throw new Error('Bot stopped')
  }

  async run(ctx: Omit<BotContext, 'tick'>): Promise<void> {
    this.running = true

    log.info({ bot: this.config.name }, 'Bot starting')

    if (this.onInit) {
      await this.onInit(ctx)
    }

    try {
      for await (const tick of this.tickGenerator()) {
        await this.onTick({ ...ctx, tick })
      }
    } catch (err) {
      if (this.running) {
        log.error({ err, bot: this.config.name }, 'Bot error')
        throw err
      }
    } finally {
      if (this.onShutdown) {
        await this.onShutdown()
      }
      log.info({ bot: this.config.name }, 'Bot stopped')
    }
  }

  stop(): void {
    this.running = false
  }
}
