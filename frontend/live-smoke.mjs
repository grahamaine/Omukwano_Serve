// Temporary live check of the confirmation service. Not committed.
import fs from 'node:fs'
import nacl from 'tweetnacl'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import anchor from '@anchor-lang/core'
const { AnchorProvider, BN, Program, Wallet } = anchor
import { TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'

const SITE = 'https://omukwano-solana.vercel.app'
const customer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.DEPLOYER_KEY)))
const idl = JSON.parse(fs.readFileSync(new URL('./src/idl/counter_program.json', import.meta.url), 'utf8'))
const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
const program = new Program(idl, new AnchorProvider(connection, new Wallet(customer), { commitment: 'confirmed' }))

const status = await (await fetch(`${SITE}/api/confirm/status`)).json()
console.log('service status:', JSON.stringify(status))
const attestor = new PublicKey(status.attestor)

// a throwaway test token and a small job confirmed by the live service
const mint = await createMint(connection, customer, customer.publicKey, null, 6)
const ata = await getOrCreateAssociatedTokenAccount(connection, customer, mint, customer.publicKey)
await mintTo(connection, customer, mint, ata.address, customer, 5_000_000)

const jobId = new BN(Date.now())
const [job] = PublicKey.findProgramAddressSync([Buffer.from('job'), customer.publicKey.toBuffer(), jobId.toArrayLike(Buffer, 'le', 8)], program.programId)
const providerKey = Keypair.generate().publicKey
await program.methods.createJob(jobId, providerKey, mint, new BN(1_000_000), 'HAIR', attestor, new BN(Math.floor(Date.now() / 1000) + 3600)).rpc()
await program.methods.fundJob().accountsPartial({ job, mint, customerTokenAccount: getAssociatedTokenAddressSync(mint, customer.publicKey), tokenProgram: TOKEN_PROGRAM_ID }).rpc()
console.log('test job funded:', job.toBase58())

const post = async (path, body) => {
  const r = await fetch(`${SITE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return `${r.status} ${JSON.stringify(await r.json().catch(() => ({})))}`
}

const msg = `Omukwano: send my confirmation code for job ${job.toBase58()}`
const goodSig = Buffer.from(nacl.sign.detached(new TextEncoder().encode(msg), customer.secretKey)).toString('base64')
const strangerSig = Buffer.from(nacl.sign.detached(new TextEncoder().encode(msg), Keypair.generate().secretKey)).toString('base64')

console.log('1. stranger asks for a code      ->', await post('/api/confirm/issue', { job: job.toBase58(), phone: '0700000000', signature: strangerSig }))
console.log('2. customer asks, bad phone      ->', await post('/api/confirm/issue', { job: job.toBase58(), phone: '123', signature: goodSig }))
console.log('3. release before any code       ->', await post('/api/confirm/release', { job: job.toBase58(), code: '123456' }))
console.log('4. customer asks for a code (SMS)->', await post('/api/confirm/issue', { job: job.toBase58(), phone: '0700000000', signature: goodSig }))
console.log('5. provider tries a wrong code   ->', await post('/api/confirm/release', { job: job.toBase58(), code: '000000' }))
console.log('6. and another wrong code        ->', await post('/api/confirm/release', { job: job.toBase58(), code: '111111' }))
