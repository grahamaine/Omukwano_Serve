import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import type { Adapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'

// Free project ID from https://cloud.reown.com (formerly WalletConnect Cloud).
export const WALLETCONNECT_PROJECT_ID: string = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? ''

export function buildWallets(): Adapter[] {
  // Phantom and Solflare: installed extension, or the in-app browser / deep link on mobile.
  const wallets: Adapter[] = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

  // WalletConnect: scan a QR code (or tap through on mobile) with any compatible wallet.
  if (WALLETCONNECT_PROJECT_ID) {
    wallets.push(
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Devnet,
        options: {
          projectId: WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: 'Pamoja',
            description: 'Pay when the service is done. Escrow for local services in East Africa.',
            url: window.location.origin,
            icons: [`${window.location.origin}/favicon-192.png`],
          },
        },
      }),
    )
  } else {
    console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set: WalletConnect is disabled.')
  }
  return wallets
}
