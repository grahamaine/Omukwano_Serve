import { useCallback, useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCounterProgram } from './useCounter'
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
    <main>
      <h1>Solana DevNet Counter</h1>
      <WalletMultiButton />
      {ctx && (
        <section>
          <p>Counter: {count === null ? 'not created yet' : count}</p>
          {count === null && <button onClick={initialize}>Create counter</button>}
          {/* TODO (you): add an "Increment" button when count !== null */}
          <p>{status}</p>
        </section>
      )}
    </main>
  )
}

export default App
