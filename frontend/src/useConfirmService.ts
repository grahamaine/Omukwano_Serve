import { useEffect, useState } from 'react'
import { getServiceStatus } from './lib/confirmApi'

/** Asks the server whether the SMS confirmation service is set up, and which key signs for it. */
export function useConfirmService() {
  const [state, setState] = useState<{ ready: boolean; attestor: string | null; loaded: boolean }>({ ready: false, attestor: null, loaded: false })
  useEffect(() => {
    let alive = true
    getServiceStatus()
      .then((s) => alive && setState({ ...s, loaded: true }))
      .catch(() => alive && setState({ ready: false, attestor: null, loaded: true }))
    return () => { alive = false }
  }, [])
  return state
}
