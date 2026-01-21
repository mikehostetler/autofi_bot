import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
  SendOptions,
  TransactionSignature,
  Commitment,
  ComputeBudgetProgram,
} from '@solana/web3.js'
import log from '../util/log'

export interface SendTxOptions {
  commitment?: Commitment
  skipPreflight?: boolean
  maxRetries?: number
  priorityFeeMicroLamports?: number
}

export async function sendAndConfirmTx(
  connection: Connection,
  tx: Transaction | VersionedTransaction,
  signers: Keypair[],
  options: SendTxOptions = {}
): Promise<TransactionSignature> {
  const {
    commitment = 'confirmed',
    skipPreflight = false,
    maxRetries = 3,
  } = options

  const blockhash = await connection.getLatestBlockhash(commitment)

  if (tx instanceof Transaction) {
    tx.recentBlockhash = blockhash.blockhash
    tx.feePayer = signers[0].publicKey
    tx.sign(...signers)
  }

  const sendOpts: SendOptions = {
    skipPreflight,
    maxRetries,
    preflightCommitment: commitment,
  }

  const rawTx =
    tx instanceof Transaction ? tx.serialize() : tx.serialize()

  const signature = await connection.sendRawTransaction(rawTx, sendOpts)

  log.debug({ signature }, 'Transaction sent')

  const confirmation = await connection.confirmTransaction(
    { signature, ...blockhash },
    commitment
  )

  if (confirmation.value.err) {
    throw new Error(
      `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
    )
  }

  log.info({ signature }, 'Transaction confirmed')
  return signature
}

export function addPriorityFee(
  tx: Transaction,
  microLamports: number
): Transaction {
  const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports,
  })
  tx.add(priorityFeeIx)
  return tx
}

export function addComputeUnits(tx: Transaction, units: number): Transaction {
  const computeIx = ComputeBudgetProgram.setComputeUnitLimit({
    units,
  })
  tx.add(computeIx)
  return tx
}
