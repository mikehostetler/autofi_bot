import { Command } from 'commander'

export const helpCommand = new Command('help').action(handleHelpCommand)

async function handleHelpCommand() {
  console.log('Help command')
  process.exit(0)
}
