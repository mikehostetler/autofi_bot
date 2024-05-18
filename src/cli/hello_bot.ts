import { Command } from 'commander'
import log from '../util/log'

export const helloBotCommand = new Command('hello-bot').action(handleHelloBotCommand)

function printMessage() {
  const timestamp = new Date().toISOString()
  log.info(`Hello from Hello Bot`)
}

function startInfiniteLoop() {
  setInterval(printMessage, 5000)
}

async function handleHelloBotCommand() {
  printMessage()
  startInfiniteLoop()
}
