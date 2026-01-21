import { Command } from 'commander'
import { helpCommand } from './help'
import { helloBotCommand } from './hello_bot'
import { statusCommand } from './status'

const cli = new Command()

cli.configureHelp({ showGlobalOptions: true })
cli.option('--rpc <url>', 'Solana RPC endpoint (overrides SOLANA_RPC_URL env var)')
cli.option('--keypair <path>', 'Path to keypair file (overrides SOLANA_SECRET_KEY env var)')

cli.addCommand(helpCommand)
cli.addCommand(helloBotCommand)
cli.addCommand(statusCommand)

export default cli
