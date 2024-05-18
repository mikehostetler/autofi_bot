import { Command } from 'commander'
import { createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { magma_onyx } from '../clients/magma_chain'
import { RPC_URL, LOCAL_PRIVATE_KEY } from '../util/env'
import log from '../util/log'
const transferABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        type: 'uint256',
        name: '_tokens',
      },
    ],
    constant: false,
    outputs: [],
    payable: false,
  },
]
export const sendErc20Command = new Command('send-erc20')
  .description('Send tokens to one or more addresses')
  .requiredOption('-a, --amount <amount>', 'Amount of tokens to send to each address')
  .requiredOption('-t, --token <address>', 'Address of the token to send')
  .requiredOption('-r, --recipients [addresses...]', 'Comma separated list of recipient addresses')
  .action(async (options, command) => {
    const { amount, token, recipients } = options
    const { rpc_provider: providerUrl, private_key: privateKey } = command.optsWithGlobals()

    const rpcProvider = providerUrl || RPC_URL
    const walletPrivateKey = privateKey || LOCAL_PRIVATE_KEY

    if (!amount) {
      throw new Error('Amount is required')
    }

    if (!token) {
      throw new Error('Token address is required')
    }

    if (!walletPrivateKey) {
      throw new Error('Private key is required')
    }

    if (!rpcProvider) {
      throw new Error('Provider URL is required')
    }

    log.debug(`Amount: ${amount}`)
    log.debug(`Token address: ${token}`)
    log.debug(`Recipients: ${recipients}`)
    log.debug(`Provider URL: ${rpcProvider}`)
    log.debug(`Wallet private key: ${walletPrivateKey}`)

    const account = privateKeyToAccount(walletPrivateKey)

    const walletClient = createWalletClient({
      chain: magma_onyx,
      transport: http(rpcProvider),
      account,
    })

    const transferAmount = parseEther(amount)

    for (const address of recipients) {
      log.info(`Sending ${amount} tokens to: ${address}`)

      try {
        const transactionHash = await walletClient.writeContract({
          address: token,
          abi: transferABI,
          functionName: 'transfer',
          args: [address, transferAmount],
          account,
        })

        log.info('Transaction successful: ', transactionHash)
      } catch (error) {
        log.error('Transaction failed: ', error)
      }
    }
  })
