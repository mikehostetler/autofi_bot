import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import { SOLANA_SECRET_KEY } from '../util/env'

export function loadWallet(): Keypair {
  if (!SOLANA_SECRET_KEY) {
    throw new Error('SOLANA_SECRET_KEY environment variable is required')
  }
  return loadWalletFromSecretKey(SOLANA_SECRET_KEY)
}

export function loadWalletFromSecretKey(secretKey: string): Keypair {
  try {
    const decoded = bs58.decode(secretKey)
    return Keypair.fromSecretKey(decoded)
  } catch {
    try {
      const parsed = JSON.parse(secretKey)
      if (Array.isArray(parsed)) {
        return Keypair.fromSecretKey(Uint8Array.from(parsed))
      }
    } catch {
      // Fall through
    }
  }
  throw new Error('Invalid secret key format. Use base58 or JSON array.')
}

export async function loadWalletFromFile(path: string): Promise<Keypair> {
  const content = await Bun.file(path).text()
  return loadWalletFromSecretKey(content.trim())
}
