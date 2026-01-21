import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js'
import log from '../util/log'

export interface SwapQuote {
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  priceImpactPct: number
  slippageBps: number
}

export interface SwapParams {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
}

export interface SwapResult {
  signature: string
  inputAmount: string
  outputAmount: string
}

const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6'

export async function getQuote(params: SwapParams): Promise<SwapQuote> {
  const { inputMint, outputMint, amount, slippageBps = 50 } = params

  const url = new URL(`${JUPITER_API_BASE}/quote`)
  url.searchParams.set('inputMint', inputMint)
  url.searchParams.set('outputMint', outputMint)
  url.searchParams.set('amount', amount.toString())
  url.searchParams.set('slippageBps', slippageBps.toString())

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Jupiter quote failed: ${response.statusText}`)
  }

  const data = (await response.json()) as {
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    priceImpactPct: string
  }

  return {
    inputMint: data.inputMint,
    outputMint: data.outputMint,
    inAmount: data.inAmount,
    outAmount: data.outAmount,
    priceImpactPct: parseFloat(data.priceImpactPct),
    slippageBps,
  }
}

export async function getSwapTransaction(
  quote: SwapQuote,
  userPublicKey: string
): Promise<VersionedTransaction> {
  const response = await fetch(`${JUPITER_API_BASE}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Jupiter swap failed: ${response.statusText}`)
  }

  const data = (await response.json()) as { swapTransaction: string }
  const swapTxBuf = Buffer.from(data.swapTransaction, 'base64')
  return VersionedTransaction.deserialize(swapTxBuf)
}

export async function executeSwap(
  connection: Connection,
  wallet: Keypair,
  params: SwapParams
): Promise<SwapResult> {
  log.info(
    { inputMint: params.inputMint, outputMint: params.outputMint, amount: params.amount },
    'Getting Jupiter quote'
  )

  const quote = await getQuote(params)
  log.debug({ quote }, 'Quote received')

  const tx = await getSwapTransaction(quote, wallet.publicKey.toBase58())
  tx.sign([wallet])

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  })

  log.info({ signature }, 'Swap transaction sent')

  const confirmation = await connection.confirmTransaction(signature, 'confirmed')
  if (confirmation.value.err) {
    throw new Error(`Swap failed: ${JSON.stringify(confirmation.value.err)}`)
  }

  log.info({ signature, inAmount: quote.inAmount, outAmount: quote.outAmount }, 'Swap confirmed')

  return {
    signature,
    inputAmount: quote.inAmount,
    outputAmount: quote.outAmount,
  }
}

export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
} as const
