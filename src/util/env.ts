import { parseEnv, z } from 'znv'

export enum LogLevel {
  silly = 0,
  trace = 1,
  debug = 2,
  info = 3,
  warn = 4,
  error = 5,
  fatal = 6,
}

let logLevel: LogLevel
if (Bun.env.LOG_LEVEL && LogLevel[Bun.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel] !== undefined) {
  logLevel = LogLevel[Bun.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel]
} else if (!isNaN(Number(Bun.env.LOG_LEVEL))) {
  logLevel = Number(Bun.env.LOG_LEVEL) as LogLevel
} else {
  logLevel = LogLevel.warn
}

export const LOG_LEVEL = logLevel

export const { NODE_ENV, SOLANA_RPC_URL, SOLANA_WS_URL, SOLANA_SECRET_KEY, COMMITMENT } = parseEnv(Bun.env, {
  NODE_ENV: z.string().default('development'),
  SOLANA_RPC_URL: z.string().default('https://api.mainnet-beta.solana.com'),
  SOLANA_WS_URL: z.string().optional(),
  SOLANA_SECRET_KEY: z.string().optional(),
  COMMITMENT: z.string().default('confirmed'),
})

// Additional wallet env vars (register in src/solana/wallets.ts):
// TRADING_WALLET_KEY - Secondary wallet for trading operations
// FEE_WALLET_KEY - Wallet for collecting fees
// SNIPER_WALLET_KEY - Dedicated wallet for sniping operations
