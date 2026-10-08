// Calls the LIVE payment routes the way the website does and reports what each provider answers.
//   node scripts/check-payments.mjs [mtn|airtel|pesapal ...]   (default: all)
// Needs no secrets: the credentials live on the server. Use your own phone number for real prompts.
const SITE = process.env.SITE || 'https://pamoja-solana.vercel.app'
const PHONE = process.env.TEST_PHONE || '0772123456'
const AMOUNT = Number(process.env.TEST_AMOUNT || 1000)
const wanted = process.argv.slice(2)
const run = (n) => wanted.length === 0 || wanted.includes(n)

const call = async (path, body) => {
  const r = await fetch(`${SITE}${path}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined)
  return { status: r.status, data: await r.json().catch(() => ({})) }
}
const poll = async (url, tries = 10) => {
  for (let i = 0; i < tries; i++) {
    const r = await call(url)
    if (r.status !== 200) return r
    if (r.data.status && r.data.status !== 'PENDING') return r
    await new Promise((res) => setTimeout(res, 3000))
  }
  return { status: 200, data: { status: 'STILL PENDING after 30s' } }
}
const show = (label, r) => console.log(`${label.padEnd(26)} ${r.status}  ${JSON.stringify(r.data)}`)

if (run('mtn')) {
  console.log('\n== MTN MoMo ==')
  const r = await call('/api/pay/mtn', { amount: AMOUNT, phone: PHONE, jobRef: 'CHECK-001' })
  show('request to pay', r)
  if (r.status === 200) show('status', await poll(`/api/pay/mtn?ref=${r.data.referenceId}`))
}
if (run('airtel')) {
  console.log('\n== Airtel Money ==')
  const r = await call('/api/pay/airtel', { amount: AMOUNT, phone: PHONE, jobRef: 'CHECK-001' })
  show('collection request', r)
  if (r.status === 200) show('status', await poll(`/api/pay/airtel?id=${r.data.transactionId}`))
}
if (run('pesapal')) {
  console.log('\n== Pesapal ==')
  const r = await call('/api/pay/pesapal', { amount: AMOUNT, jobRef: 'CHECK-001', email: 'test@example.com' })
  show('submit order', r.status === 200 ? { status: 200, data: { redirectUrl: r.data.redirectUrl ? '(received)' : '(missing)' } } : r)
}
console.log('\nA 500 "Server is missing …" means that provider is not configured yet. A 502 means the provider rejected the call: check Vercel logs.')
