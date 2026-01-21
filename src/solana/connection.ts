import { Connection, Commitment } from '@solana/web3.js'
import { SOLANA_RPC_URL, SOLANA_WS_URL, COMMITMENT } from '../util/env'

let connection: Connection | null = null

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_RPC_URL, {
      commitment: COMMITMENT as Commitment,
      wsEndpoint: SOLANA_WS_URL || undefined,
    })
  }
  return connection
}

export function createConnection(
  rpcUrl: string,
  commitment: Commitment = 'confirmed'
): Connection {
  return new Connection(rpcUrl, { commitment })
}
