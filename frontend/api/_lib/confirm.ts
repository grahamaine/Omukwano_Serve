import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { AnchorProvider, Program, Wallet } from '@anchor-lang/core'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountIdempotentInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token'
import nacl from 'tweetnacl'
import { HttpError, normalisePhone } from './common.js'
import { IDL } from './idl.js'

// The confirmation service: sends the customer a 6-digit code, checks it when the provider enters
// it, and only then signs `release` as the job's attestor. The code is never stored in plain text
// and never goes on-chain, because a 6-digit code could be recovered from a public hash instantly.

export const MAX_ISSUES = 3 // codes the customer can request per job
export const MAX_TRIES = 5 // wrong guesses allowed per code

export interface Store {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlSeconds: number): Promise<void>
  incr(key: string, ttlSeconds: number): Promise<number>
  del(key: string): Promise<void>
}

export interface Sms {
  send(to: string, text: string): Promise<void>
}

export interface Deps {
  connection: Connection
  attestor: Keypair
  store: Store
  sms: Sms
  secret: string // server-only; mixes into the stored code hash
}

const TTL = 60 * 60 * 24 * 60 // keep codes for 60 days

export const issueMessage = (job: string) => `Pamoja: send my confirmation code for job ${job}`

const program = (d: Deps) =>
  new Program(IDL, new AnchorProvider(d.connection, new Wallet(d.attestor), { commitment: 'confirmed' })) as any

const hashCode = (d: Deps, job: string, code: string) =>
  createHash('sha256').update(`${d.secret}:${job}:${code}`).digest('hex')

async function loadFundedJob(d: Deps, jobAddress: string) {
  let job: PublicKey
  try { job = new PublicKey(jobAddress) } catch { throw new HttpError(400, 'Invalid job address') }
  let acc: any
  try {
    acc = await program(d).account.job.fetchNullable(job)
  } catch (e) {
    // an address that exists but is not one of our jobs fails to decode
    if (/discriminator|decode|Invalid account|Account does not belong/i.test(String((e as Error).message))) acc = null
    else throw e
  }
  if (!acc) throw new HttpError(404, 'Job not found')
  if (!acc.attestor.equals(d.attestor.publicKey)) throw new HttpError(403, 'This job is not confirmed by the Pamoja service')
  if (Object.keys(acc.status)[0] !== 'funded') throw new HttpError(409, 'The job has not been paid in, or is already finished')
  return { job, acc }
}

/** The customer proves they own the job (wallet signature), then gets the code by SMS. */
export async function issueCode(d: Deps, input: { job: string; phone: string; signature: string }) {
  const { job, acc } = await loadFundedJob(d, input.job)
  const phone = normalisePhone(input.phone)

  let signature: Uint8Array
  try { signature = Uint8Array.from(Buffer.from(String(input.signature), 'base64')) } catch { throw new HttpError(400, 'Invalid signature') }
  const ok = nacl.sign.detached.verify(new TextEncoder().encode(issueMessage(input.job)), signature, acc.customer.toBytes())
  if (!ok) throw new HttpError(403, 'Only the customer of this job can request the code')

  const issued = await d.store.incr(`issued:${input.job}`, TTL)
  if (issued > MAX_ISSUES) throw new HttpError(429, 'The code was already sent the maximum number of times')

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  await d.store.set(`code:${input.job}`, hashCode(d, input.job, code), TTL)
  await d.store.del(`tries:${input.job}`)

  const ref = String(acc.reference)
  const short = `${input.job.slice(0, 4)}…${input.job.slice(-4)}`
  await d.sms.send(
    `+${phone.intl}`,
    `Pamoja code: PMJ-${ref}-${code}. Give it to the provider only when the service is done. Job ${short}.`,
  )
  return { sent: true, resendsLeft: MAX_ISSUES - issued }
}

/** The provider enters the code. If it matches, the service signs the release. */
export async function releaseWithCode(d: Deps, input: { job: string; code: string }) {
  const { job, acc } = await loadFundedJob(d, input.job)

  // accept "483920" or the full "PMJ-HAIR-483920"
  const digits = String(input.code ?? '').trim().split('-').pop()!.replace(/\s/g, '')
  if (!/^\d{6}$/.test(digits)) throw new HttpError(400, 'Enter the 6-digit code from the SMS')

  const stored = await d.store.get(`code:${input.job}`)
  if (!stored) throw new HttpError(409, 'No code has been sent for this job yet')

  const tries = await d.store.incr(`tries:${input.job}`, TTL) // count first, so parallel guesses cannot dodge the limit
  if (tries > MAX_TRIES) throw new HttpError(429, 'Too many wrong codes. Ask the customer to request a new code.')

  const a = Buffer.from(stored, 'hex')
  const b = Buffer.from(hashCode(d, input.job, digits), 'hex')
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new HttpError(400, `Wrong code. ${MAX_TRIES - tries} ${MAX_TRIES - tries === 1 ? 'try' : 'tries'} left.`)
  }

  const providerToken = getAssociatedTokenAddressSync(acc.mint, acc.provider)
  const signature: string = await program(d)
    .methods.release()
    .accountsPartial({
      attestor: d.attestor.publicKey,
      job,
      mint: acc.mint,
      providerTokenAccount: providerToken,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .preInstructions([createAssociatedTokenAccountIdempotentInstruction(d.attestor.publicKey, providerToken, acc.provider, acc.mint)])
    .rpc()

  await d.store.del(`code:${input.job}`)
  return { released: true, signature }
}
