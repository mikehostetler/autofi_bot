import { defineChain } from 'viem'

export const magma_onyx = defineChain({
  id: 6969696969,
  name: 'Magma',
  nativeCurrency: {
    decimals: 18,
    name: 'Lava',
    symbol: 'LAVA',
  },
  rpcUrls: {
    default: {
      http: ['https://turbo.magma-rpc.com'],
      webSocket: ['wss://turbo.magma-rpc.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'http://www.magmascan.org' },
  },
  batch: {
    multicall: {
      wait: 8,
    },
  },
  contracts: {
    multicall3: {
      address: '0x5e74D928CC499D3d2544B0286e392539739D4c60',
      blockCreated: 2776,
    },
  },
})
