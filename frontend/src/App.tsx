import { useCallback, useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCounterProgram } from './useCounter'
import logo from './assets/logo-mark.png'
import './App.css'

function App() {
  const ctx = useCounterProgram()
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState('')

  const refresh = useCallback(async () => {
    if (!ctx) return
    const acc = await ctx.program.account.counter.fetchNullable(ctx.counterPda)
    setCount(acc ? acc.count.toNumber() : null)
  }, [ctx])

  useEffect(() => { refresh().catch(console.error) }, [refresh])

  const initialize = async () => {
    if (!ctx) return
    setStatus('Sending…')
    try {
      const sig = await ctx.program.methods.initialize().rpc()
      setStatus(`Created: ${sig.slice(0, 12)}…`)
      await refresh()
    } catch (e) {
      setStatus(String(e))
    }
  }

  // TODO (you): add an `increment` handler here once the on-chain
  // instruction exists. Pattern: ctx.program.methods.increment().rpc()

  return (
    <main className="app">
      <header className="brand-bar">
        <div className="brand">
          <img src={logo} alt="Omukwano logo" />
          <div className="brand-name">Omukwano<span>Services &amp; Suppliers</span></div>
        </div>
        <WalletMultiButton />
      </header>

      <section className="hero">
        <h1>Pay when the service is done</h1>
        <p>Lock the payment. Confirm with a code. The provider gets paid.</p>
      </section>

      {ctx && (
        <section className="card">
          <p className="count">Counter: {count === null ? 'not created yet' : count}</p>
          {count === null && <button className="primary" onClick={initialize}>Create counter</button>}
          {/* TODO (you): add an "Increment" button when count !== null */}
          <p className="status">{status}</p>
        </section>
      )}
    </main>
  )
}

export default App
