import NetworkSolana from '@web3icons/react/icons/networks/NetworkSolana'
import NetworkEthereum from '@web3icons/react/icons/networks/NetworkEthereum'
import NetworkBase from '@web3icons/react/icons/networks/NetworkBase'
import NetworkArbitrumOne from '@web3icons/react/icons/networks/NetworkArbitrumOne'
import NetworkPolygon from '@web3icons/react/icons/networks/NetworkPolygon'
import NetworkBinanceSmartChain from '@web3icons/react/icons/networks/NetworkBinanceSmartChain'
import NetworkOptimism from '@web3icons/react/icons/networks/NetworkOptimism'
import NetworkAvalanche from '@web3icons/react/icons/networks/NetworkAvalanche'
import NetworkSui from '@web3icons/react/icons/networks/NetworkSui'
import NetworkAptos from '@web3icons/react/icons/networks/NetworkAptos'
import NetworkTon from '@web3icons/react/icons/networks/NetworkTon'
import NetworkTron from '@web3icons/react/icons/networks/NetworkTron'
import NetworkBitcoin from '@web3icons/react/icons/networks/NetworkBitcoin'
import type { ComponentType } from 'react'

export type Chain = { name: string; Icon: ComponentType<{ size?: number; variant?: 'branded' | 'mono' }> }

export const CHAINS: Chain[] = [
  { name: 'Solana', Icon: NetworkSolana },
  { name: 'Ethereum', Icon: NetworkEthereum },
  { name: 'Base', Icon: NetworkBase },
  { name: 'Arbitrum', Icon: NetworkArbitrumOne },
  { name: 'Polygon', Icon: NetworkPolygon },
  { name: 'BNB Chain', Icon: NetworkBinanceSmartChain },
  { name: 'Optimism', Icon: NetworkOptimism },
  { name: 'Avalanche', Icon: NetworkAvalanche },
  { name: 'Sui', Icon: NetworkSui },
  { name: 'Aptos', Icon: NetworkAptos },
  { name: 'TON', Icon: NetworkTon },
  { name: 'Tron', Icon: NetworkTron },
  { name: 'Bitcoin', Icon: NetworkBitcoin },
]
