import { PublicKey } from '@solana/web3.js'

// Circle's test USDC on Solana devnet (6 decimals). Override with VITE_STABLECOIN_MINT.
export const STABLE_MINT = new PublicKey(
  import.meta.env.VITE_STABLECOIN_MINT || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
)
export const STABLE_SYMBOL = 'USDC'
export const STABLE_DECIMALS = 6

// The confirmation service that signs `release` once it has checked the customer's SMS code.
// Until that service exists, leave this empty and the customer confirms their own job (demo mode).
export const ATTESTOR_ADDRESS: string = import.meta.env.VITE_ATTESTOR_PUBKEY || ''

export const PROGRAM_ID = '9dLzUWtKppSVHsBBAAea7nqhWUy2pzY3E19PrnGdP2Q4'
export const explorer = (address: string) => `https://explorer.solana.com/address/${address}?cluster=devnet`
