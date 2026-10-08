import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { requestCode, submitCode } from '../lib/confirmApi'
import { friendly } from '../useEscrow'

// Customer: text yourself the code. Provider: enter the code you were given to get paid.
export function ConfirmBox({ job, role, onDone }: { job: string; role: 'customer' | 'provider'; onDone: () => void }) {
  const { signMessage } = useWallet()
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)

  const run = async () => {
    setBusy(true)
    setOk(false)
    setMsg(role === 'customer' ? 'Approve the signature request in your wallet…' : 'Checking the code…')
    try {
      if (role === 'customer') {
        if (!signMessage) throw new Error('This wallet cannot sign messages. Try Phantom or Solflare.')
        const r = await requestCode(job, value, signMessage)
        setOk(true)
        setMsg(`Code sent by SMS. Give it to the provider only when the service is done. Re-sends left: ${r.resendsLeft}.`)
      } else {
        await submitCode(job, value)
        setOk(true)
        setMsg('Code accepted. You have been paid.')
        onDone()
      }
    } catch (e) {
      setMsg(friendly(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="confirm-box">
      <div className="confirm-row">
        <input
          inputMode={role === 'customer' ? 'tel' : 'numeric'}
          placeholder={role === 'customer' ? 'Your mobile, e.g. 0772 123456' : '6-digit code'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={busy}
          aria-label={role === 'customer' ? 'Your mobile number' : 'Confirmation code'}
        />
        <button className="mini primary" onClick={run} disabled={busy || !value.trim()}>
          {role === 'customer' ? 'Text me the code' : 'Submit code'}
        </button>
      </div>
      {msg && <small className={ok ? 'ok' : 'note'}>{msg}</small>}
    </div>
  )
}
