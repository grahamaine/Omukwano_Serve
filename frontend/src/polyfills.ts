import { Buffer } from 'buffer'

// Must be imported first: some Solana libraries read `Buffer` while they load.
;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
