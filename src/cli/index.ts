import { Command } from 'commander'
import { helpCommand } from './help'
import { helloBotCommand } from './hello_bot'
import { sendErc20Command } from './send_erc20'
import { keyFromMnemonicCommand } from './key_from_mnemonic'

const cli = new Command()

cli.configureHelp({ showGlobalOptions: true })
cli.option('--rpc_provider <url>', 'Provider RPC endpoint (overrides RPC_URL env var)')
cli.option('--private_key <private_key>', 'Local wallet private key (overrides LOCAL_PRIVATE_KEY env var)')

cli.addCommand(helpCommand)
cli.addCommand(helloBotCommand)
cli.addCommand(sendErc20Command)
cli.addCommand(keyFromMnemonicCommand)

export default cli
