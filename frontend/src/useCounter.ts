import { useMemo } from 'react'
import { AnchorProvider, Program } from '@anchor-lang/core'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import idl from './idl/counter_program.json'
import type { CounterProgram } from './idl/counter_program'

const SEED = 'anchor' // must match SEED in programs/counter-program/src/constants.rs

export function useCounterProgram() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  return useMemo(() => {
    if (!wallet) return null
    const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' })
    const program = new Program<CounterProgram>(idl as CounterProgram, provider)
    const [counterPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode(SEED), wallet.publicKey.toBytes()],
      program.programId,
    )
    return { program, counterPda, wallet }
  }, [connection, wallet])
}
