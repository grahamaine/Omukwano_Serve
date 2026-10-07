import { useCallback, useEffect, useState } from 'react'
import { Lock, BriefcaseBusiness, KeyRound, Smartphone, Wallet, ShieldCheck, Store, Menu, X, type LucideIcon } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCounterProgram } from './useCounter'
import { ChainMarquee } from './ui/ChainMarquee'
import { Dashboard } from './ui/Dashboard'
import { Services } from './ui/Services'
import { PayWidget } from './ui/PayWidget'
import logo from './assets/logo-mark.png'
import './App.css'

const STEPS: { n: string; title: string; text: string; Icon: LucideIcon }[] = [
  { n: '1', Icon: Lock, title: 'Lock the payment', text: 'The customer deposits the price. It sits in a Solana program, not with either side.' },
  { n: '2', Icon: BriefcaseBusiness, title: 'Get the service', text: 'The provider does the job: a haircut, a repair, a delivery.' },
  { n: '3', Icon: KeyRound, title: 'Confirm with a code', text: 'The customer shares a short SMS code. The program checks it and pays the provider.' },
]

const FEATURES: { title: string; text: string; Icon: LucideIcon }[] = [
  { Icon: Smartphone, title: 'Works on any phone', text: 'No QR codes. A 4–6 digit code by SMS or WhatsApp is all a customer needs.' },
  { Icon: Wallet, title: 'Three ways to pay', text: 'Crypto (USDC), mobile money or bank transfer, all settled into one escrow.' },
  { Icon: ShieldCheck, title: 'No-show protection', text: 'Deposits release by rule: refund, pay out, or auto-release after a deadline.' },
  { Icon: Store, title: 'Built for local business', text: 'Salons, repairs, suppliers and event services across East Africa.' },
]

function App() {
  const ctx = useCounterProgram()
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [menu, setMenu] = useState(false)

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
        <nav className={menu ? 'nav-links open' : 'nav-links'} onClick={() => setMenu(false)}>
          <a href="#how">How it works</a>
          <a href="#services">Services</a>
          <a href="#why">Why Omukwano</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#pay">Pay</a>
          <a href="#try">Try on devnet</a>
        </nav>
        <div className="nav-actions">
          <WalletMultiButton />
          <button className="menu-btn" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
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
          <div className="grid grid-wide">
            {STEPS.map((s) => (
              <article className="card wide" key={s.n}>
                <span className="ico"><s.Icon size={26} strokeWidth={1.8} /></span>
                <div className="body">
                  <h3><span className="num">{s.n}</span>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section">
          <h2>Services &amp; store</h2>
          <p className="sub">From salons and repairs to rides, food and shopping. If someone is paid for a job or an order, it fits.</p>
          <Services />
        </section>

        <ChainMarquee title="Built on Solana · connects to" />

        <section id="why" className="section">
          <h2>Why Omukwano</h2>
          <p className="sub">Designed for how people in Uganda actually pay.</p>
          <div className="grid grid-wide">
            {FEATURES.map((f) => (
              <article className="card wide" key={f.title}>
                <span className="ico"><f.Icon size={26} strokeWidth={1.8} /></span>
                <div className="body">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dashboard" className="section">
          <h2>Business dashboard</h2>
          <p className="sub">Track deposits, payouts and your provider level in one place.</p>
          <Dashboard />
        </section>

        <section id="pay" className="section">
          <h2>Pay for a job</h2>
          <p className="sub">Choose how you pay. Mobile money and card payments are collected by our payment partners.</p>
          <PayWidget />
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
