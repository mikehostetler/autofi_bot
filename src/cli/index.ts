import { Command } from 'commander'
import { helpCommand } from './help'
import { helloBotCommand } from './hello_bot'

const cli = new Command()

cli.configureHelp({ showGlobalOptions: true })
cli.addCommand(helpCommand)
cli.addCommand(helloBotCommand)

export default cli
