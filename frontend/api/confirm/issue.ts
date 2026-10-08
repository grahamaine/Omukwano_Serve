import { requireMethod, route } from '../_lib/common.js'
import { issueCode } from '../_lib/confirm.js'
import { buildDeps } from '../_lib/services.js'

// POST /api/confirm/issue  { job, phone, signature }
// The customer signs "Pamoja: send my confirmation code for job <address>" with their wallet.
// Replies { sent: true, resendsLeft }. The code itself only ever travels by SMS.
export default route(async (req) => {
  requireMethod(req, 'POST')
  return issueCode(buildDeps(), { job: req.body?.job, phone: req.body?.phone, signature: req.body?.signature })
})
