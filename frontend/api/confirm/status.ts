import { Keypair } from '@solana/web3.js'
import { requireMethod, route } from '../_lib/common.js'

// GET /api/confirm/status -> { ready, attestor }
// The website asks this before creating jobs. Until every setting exists the service reports
// "not ready" and the website stays in demo mode, so no job is ever tied to a service that is off.
const NEEDED = ['ATTESTOR_SECRET_KEY', 'CODE_SECRET', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'AT_USERNAME', 'AT_API_KEY']

export default route(async (req) => {
  requireMethod(req, 'GET')
  if (NEEDED.some((k) => !process.env[k])) return { ready: false, attestor: null }
  try {
    const kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.ATTESTOR_SECRET_KEY!) as number[]))
    return { ready: true, attestor: kp.publicKey.toBase58() }
  } catch {
    return { ready: false, attestor: null }
  }
})
