import { requireMethod, route } from '../_lib/common.js'
import { releaseWithCode } from '../_lib/confirm.js'
import { buildDeps } from '../_lib/services.js'

// POST /api/confirm/release  { job, code }
// The provider enters the code the customer received. A correct code makes the service sign the
// on-chain release, which pays the provider. Wrong codes are counted and locked after 5 tries.
export default route(async (req) => {
  requireMethod(req, 'POST')
  return releaseWithCode(buildDeps(), { job: req.body?.job, code: req.body?.code })
})
