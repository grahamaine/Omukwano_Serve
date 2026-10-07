import { useCallback, useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCounterProgram } from './useCounter'
import { ChainMarquee } from './ui/ChainMarquee'
import logo from './assets/logo-mark.png'
import './App.css'

const STEPS = [
  { n: '1', title: 'Lock the payment', text: 'The customer deposits the price. It sits in a Solana program, not with either side.' },
  { n: '2', title: 'Get the service', text: 'The provider does the job: a haircut, a repair, a delivery.' },
  { n: '3', title: 'Confirm with a code', text: 'The customer shares a short SMS code. The program checks it and pays the provider.' },
]

const FEATURES = [
  { title: 'Works on any phone', text: 'No QR codes. A 4–6 digit code by SMS or WhatsApp is all a customer needs.' },
  { title: 'Three ways to pay', text: 'Crypto (USDC), mobile money or bank transfer, all settled into one escrow.' },
  { title: 'No-show protection', text: 'Deposits release by rule: refund, pay out, or auto-release after a deadline.' },
  { title: 'Built for local business', text: 'Salons, repairs, suppliers and event services across East Africa.' },
]

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
    <>
      <header className="nav">
        <a className="brand" href="#top">
          <img src={logo} alt="Omukwano logo" />
          <span>Omukwano</span>
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#why">Why Omukwano</a>
          <a href="#try">Try on devnet</a>
        </nav>
        <WalletMultiButton />
      </header>

      <main id="top" className="page">
        <section className="hero">
          <span className="pill"><i /> Live on Solana Devnet</span>
          <h1>Pay When The<br />Service Is Done.</h1>
          <p className="lead">Escrow for salons, suppliers and local services in East Africa. Lock the payment, confirm with a code, and the provider gets paid.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#try">Try the demo</a>
            <a className="btn btn-ghost" href="#how">How it works →</a>
          </div>
        </section>

        <section id="how" className="section">
          <h2>How it works</h2>
          <p className="sub">Three steps. No middleman holding your money.</p>
          <div className="grid grid-3">
            {STEPS.map((s) => (
              <article className="card" key={s.n}>
                <span className="step">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <ChainMarquee title="Built on Solana · connects to" />

        <section id="why" className="section">
          <h2>Why Omukwano</h2>
          <p className="sub">Designed for how people in Uganda actually pay.</p>
          <div className="grid grid-4">
            {FEATURES.map((f) => (
              <article className="card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="try" className="section">
          <h2>Try it on devnet</h2>
          <p className="sub">Connect a wallet to create your first on-chain account. No real money involved.</p>
          <div className="card demo">
            {ctx ? (
              <>
                <p className="count">Counter: <strong>{count === null ? 'not created yet' : count}</strong></p>
                {count === null && <button className="btn btn-primary" onClick={initialize}>Create counter</button>}
                {/* TODO (you): add an "Increment" button when count !== null */}
                <p className="status">{status}</p>
              </>
            ) : (
              <p>Connect your wallet (top right) to get started.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="brand"><img src={logo} alt="" /><span>Omukwano · Services &amp; Suppliers</span></div>
        <p>Built on Solana · Encode Club Solana Hackathon 2026</p>
      </footer>
    </>
  )
}

export default App
