import { BN, type Program } from '@anchor-lang/core'
import { PublicKey } from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import type { CounterProgram } from '../idl/counter_program'

// Talks to the Pamoja escrow program. No React or browser code in here.

export type JobStatus = 'created' | 'funded' | 'released' | 'cancelled' | 'refunded'

export type JobView = {
  address: PublicKey
  customer: PublicKey
  provider: PublicKey
  mint: PublicKey
  attestor: PublicKey
  amount: BN
  deadline: BN
  jobId: BN
  reference: string
  status: JobStatus
}

export type EscrowProgram = Program<CounterProgram>

export const jobAddress = (programId: PublicKey, customer: PublicKey, jobId: BN) =>
  PublicKey.findProgramAddressSync(
    [new TextEncoder().encode('job'), customer.toBytes(), jobId.toArrayLike(Buffer, 'le', 8)],
    programId,
  )[0]

/** Whole-token amount (e.g. "12.5") to the token's smallest unit. */
export function toBaseUnits(amount: string, decimals = 6): BN {
  const [whole, frac = ''] = amount.trim().split('.')
  if (!/^\d*$/.test(whole) || !/^\d*$/.test(frac)) throw new Error('Enter a valid amount')
  const padded = (frac + '0'.repeat(decimals)).slice(0, decimals)
  return new BN(`${whole || '0'}${padded}`)
}

export const fromBaseUnits = (amount: BN, decimals = 6) => {
  const s = amount.toString().padStart(decimals + 1, '0')
  const whole = s.slice(0, -decimals)
  const frac = s.slice(-decimals).replace(/0+$/, '')
  return frac ? `${whole}.${frac}` : whole
}

const statusOf = (s: object): JobStatus => Object.keys(s)[0] as JobStatus

/** Every job where this wallet is the customer, the provider or the confirmer. */
export async function listJobs(program: EscrowProgram, me: PublicKey): Promise<JobView[]> {
  const all = await program.account.job.all()
  return all
    .map(({ publicKey, account }) => ({ address: publicKey, ...account, status: statusOf(account.status) }) as JobView)
    .filter((j) => [j.customer, j.provider, j.attestor].some((k) => k.equals(me)))
    .sort((a, b) => b.jobId.cmp(a.jobId))
}

export type NewJob = {
  provider: PublicKey
  mint: PublicKey
  amount: BN
  reference: string
  attestor: PublicKey
  deadline: BN // unix seconds
}

/** Creates the job, then locks the payment in the vault. Returns the job address. */
export async function createAndFundJob(program: EscrowProgram, me: PublicKey, p: NewJob): Promise<PublicKey> {
  const jobId = new BN(Date.now())
  const job = jobAddress(program.programId, me, jobId)

  await program.methods.createJob(jobId, p.provider, p.mint, p.amount, p.reference, p.attestor, p.deadline).rpc()
  await fundJob(program, me, { address: job, mint: p.mint })
  return job
}

export async function fundJob(program: EscrowProgram, me: PublicKey, j: Pick<JobView, 'address' | 'mint'>) {
  return program.methods
    .fundJob()
    .accountsPartial({
      job: j.address,
      mint: j.mint,
      customerTokenAccount: getAssociatedTokenAddressSync(j.mint, me),
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc()
}

export const cancelJob = (program: EscrowProgram, j: Pick<JobView, 'address'>) =>
  program.methods.cancel().accountsPartial({ job: j.address }).rpc()

export const refundJob = (program: EscrowProgram, me: PublicKey, j: Pick<JobView, 'address' | 'mint'>) =>
  program.methods
    .refund()
    .accountsPartial({
      job: j.address,
      mint: j.mint,
      customerTokenAccount: getAssociatedTokenAddressSync(j.mint, me),
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc()

/** Only the job's attestor can release. Creates the provider's token account if it does not exist yet. */
export async function releaseJob(program: EscrowProgram, me: PublicKey, j: Pick<JobView, 'address' | 'mint' | 'provider'>) {
  const providerToken = getAssociatedTokenAddressSync(j.mint, j.provider)
  return program.methods
    .release()
    .accountsPartial({
      attestor: me,
      job: j.address,
      mint: j.mint,
      providerTokenAccount: providerToken,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .preInstructions([createAssociatedTokenAccountIdempotentInstruction(me, providerToken, j.provider, j.mint)])
    .rpc()
}

