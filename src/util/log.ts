import pino from 'pino'
import { LOG_LEVEL } from './env'

const level = typeof LOG_LEVEL === 'number' 
  ? ['silly', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'][LOG_LEVEL] ?? 'info'
  : String(LOG_LEVEL)

const log = pino({
  level,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

export default log
