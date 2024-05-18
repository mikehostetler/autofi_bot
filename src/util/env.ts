import dotenv from 'dotenv'
import { parseEnv, z } from 'znv'

dotenv.config()

export enum LogLevel {
  silly = 0,
  trace = 1,
  debug = 2,
  info = 3,
  warn = 4,
  error = 5,
  fatal = 6,
}

/**
 * ZNV doesn't support ZodUnion types, so we have to do this manually
 */
let logLevel: LogLevel
if (process.env.LOG_LEVEL && LogLevel[process.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel] !== undefined) {
  logLevel = LogLevel[process.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel]
} else if (!isNaN(Number(process.env.LOG_LEVEL))) {
  logLevel = Number(process.env.LOG_LEVEL) as LogLevel
} else {
  logLevel = LogLevel.warn // default value
}

export const LOG_LEVEL = logLevel

export const { NODE_ENV, PROVIDER_URL, WALLET_PRIVATE_KEY, UNISWAPV3_ROUTER_ADDRESS, UNISWAPV3_FACTORY_ADDRESS, USDT_ADDRESS, USDC_ADDRESS } = parseEnv(process.env, {
  NODE_ENV: z.string().default('development'),
  PROVIDER_URL: z.string().default('http://localhost:8545'),
  WALLET_PRIVATE_KEY: z.string().default('0x0000000000000000000000000000000000000000'),
  UNISWAPV3_ROUTER_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),
  UNISWAPV3_FACTORY_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),
  USDT_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),
  USDC_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),
})
