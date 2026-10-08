// One-off: creates an MTN MoMo SANDBOX API user and API key for your Collections subscription.
// Run it on your own machine so the keys never pass through chat:
//   PowerShell:  $env:MTN_SUBSCRIPTION_KEY = "<primary key from the MoMo developer portal>"; node scripts/mtn-sandbox-setup.mjs
import { randomUUID } from 'node:crypto'

const BASE = 'https://sandbox.momodeveloper.mtn.com'
const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY?.trim().replace(/^["']|["']$/g, '')
if (!subscriptionKey) {
  console.error('Set MTN_SUBSCRIPTION_KEY first (Collections "Primary key" from momodeveloper.mtn.com).')
  process.exit(1)
}

const userId = randomUUID()
const headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey, 'Content-Type': 'application/json' }

const create = await fetch(`${BASE}/v1_0/apiuser`, {
  method: 'POST',
  headers: { ...headers, 'X-Reference-Id': userId },
  body: JSON.stringify({ providerCallbackHost: 'pamoja-solana.vercel.app' }),
})
if (create.status !== 201) {
  console.error(`Creating the API user failed (${create.status}): ${await create.text()}`)
  console.error('Check that the subscription key is the Collections product key.')
  process.exit(1)
}

const key = await fetch(`${BASE}/v1_0/apiuser/${userId}/apikey`, { method: 'POST', headers })
if (!key.ok) {
  console.error(`Creating the API key failed (${key.status}): ${await key.text()}`)
  process.exit(1)
}
const { apiKey } = await key.json()

console.log('\nSandbox credentials created. Add each one to Vercel (production), answering "yes" to sensitive:\n')
console.log(`  MTN_API_USER   = ${userId}`)
console.log(`  MTN_API_KEY    = ${apiKey}`)
console.log('  MTN_BASE_URL   = https://sandbox.momodeveloper.mtn.com')
console.log('  MTN_TARGET_ENV = sandbox')
console.log('  MTN_CURRENCY   = EUR')
console.log('  MTN_SUBSCRIPTION_KEY = (the key you just used)\n')
console.log('Example:  vercel env add MTN_API_USER production');
console.log('Keep these private. The API key cannot be shown again.')
