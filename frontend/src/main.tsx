import { Buffer } from 'buffer'
;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'
import './index.css'
import App from './App.tsx'

// Wallet Standard wallets (Phantom, Solflare, Backpack...) are auto-detected.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider endpoint={import.meta.env.VITE_RPC_URL || clusterApiUrl('devnet')}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
)
