import { Keypair, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import log from '../util/log'

export interface WalletConfig {
  name: string
  secretKey: string // base58 or JSON array
}

export interface Wallet {
  name: string
  keypair: Keypair
  publicKey: PublicKey
  address: string
}

class WalletService {
  private wallets: Map<string, Wallet> = new Map()

  register(name: string, secretKey: string): Wallet {
    const keypair = this.parseSecretKey(secretKey)
    const wallet: Wallet = {
      name,
      keypair,
      publicKey: keypair.publicKey,
      address: keypair.publicKey.toBase58(),
    }
    this.wallets.set(name, wallet)
    log.debug({ name, address: wallet.address }, 'Wallet registered')
    return wallet
  }

  registerFromEnv(name: string, envVar: string): Wallet | null {
    const secretKey = Bun.env[envVar]
    if (!secretKey) {
      log.warn({ name, envVar }, 'Wallet env var not set')
      return null
    }
    return this.register(name, secretKey)
  }

  get(name: string): Wallet {
    const wallet = this.wallets.get(name)
    if (!wallet) {
      throw new Error(`Wallet "${name}" not found. Did you register it?`)
    }
    return wallet
  }

  tryGet(name: string): Wallet | null {
    return this.wallets.get(name) ?? null
  }

  has(name: string): boolean {
    return this.wallets.has(name)
  }

  list(): Wallet[] {
    return Array.from(this.wallets.values())
  }

  listAddresses(): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [name, wallet] of this.wallets) {
      result[name] = wallet.address
    }
    return result
  }

  private parseSecretKey(secretKey: string): Keypair {
    // Try base58 first
    try {
      const decoded = bs58.decode(secretKey.trim())
      return Keypair.fromSecretKey(decoded)
    } catch {
      // Try JSON array
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
}

export const wallets = new WalletService()

export function initWalletsFromEnv(): void {
  // Primary bot wallet
  wallets.registerFromEnv('main', 'SOLANA_SECRET_KEY')

  // Additional wallets can be added here
  // wallets.registerFromEnv('trading', 'TRADING_WALLET_KEY')
  // wallets.registerFromEnv('fees', 'FEE_WALLET_KEY')
}
