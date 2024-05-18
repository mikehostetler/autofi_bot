import { Command } from 'commander'
import { ethers } from 'ethers'
import { RPC_URL, LOCAL_PRIVATE_KEY } from '../util/env'
import log from '../util/log'

export const sendTokenCommand = new Command('send-token')
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

    const provider = new ethers.JsonRpcProvider(rpcProvider)
    const wallet = new ethers.Wallet(walletPrivateKey, provider)

    for (const address of recipients) {
      log.info(`Sending ${amount} tokens to: ${address}`)

      const tx = {
        to: address,
        value: ethers.parseUnits(amount, 18),
        data: token,
      }

      try {
        const transactionResponse = await wallet.sendTransaction(tx)
        log.info('Transaction successful: ', transactionResponse.hash)
      } catch (error) {
        log.error('Transaction failed: ', error)
      }
    }
  })
