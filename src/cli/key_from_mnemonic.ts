import { Command } from 'commander'
import { ethers } from 'ethers'

export const keyFromMnemonicCommand = new Command('key-from-mnemonic')
  .description('Extract a private key from a mnemonic phrase')
  .requiredOption('-m, --mnemonic <mnemonic>', 'Mnemonic phrase (enclosed in quotes)')
  .action(async options => {
    const { mnemonic } = options

    if (!mnemonic) {
      throw new Error('Mnemonic phrase is required')
    }

    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic)
      const privateKey = wallet.privateKey
      console.log('Private Key:', privateKey)
    } catch (error) {
      console.error('Error extracting private key:', error)
    }
  })
