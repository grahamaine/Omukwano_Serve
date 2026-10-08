import { useCallback, useEffect, useState } from 'react'
import { Lock, BriefcaseBusiness, KeyRound, Smartphone, Wallet, ShieldCheck, Store, type LucideIcon } from 'lucide-react'
import { useCounterProgram } from './useCounter'
import { ChainMarquee } from './ui/ChainMarquee'
import { Dashboard } from './ui/Dashboard'
import { Services } from './ui/Services'
import { PayWidget } from './ui/PayWidget'
import { ProfileHeader, RightRail, Section, SideRail, TabBar, TABS, TopBar, type TabId } from './ui/Shell'
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

const tabFromHash = (): TabId => {
  const h = window.location.hash.replace('#', '')
  return TABS.some((t) => t.id === h) ? (h as TabId) : 'home'
}

function App() {
  const ctx = useCounterProgram()
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [tab, setTab] = useState<TabId>(tabFromHash)
  const [query, setQuery] = useState('')

  const go = useCallback((t: TabId) => {
    setTab(t)
    window.history.replaceState(null, '', t === 'home' ? window.location.pathname : `#${t}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

  const pickCategory = (ref: string) => { setQuery(ref); go('services') }

  return (
    <>
      <TopBar tab={tab} onTab={go} query={query} onQuery={setQuery} />

      <div className="shell">
        <SideRail tab={tab} query={query} onPick={pickCategory} onHome={() => { setQuery(''); go('home') }} />

        <div className="main">
          <ProfileHeader onTab={go} />
          <TabBar tab={tab} onTab={(t) => { if (t !== 'services') setQuery(''); go(t) }} />

          <div className="content">
            {tab === 'home' && (
              <>
                <Section title="How it works" sub="Three steps. No middleman holding your money.">
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
                </Section>

                <ChainMarquee title="Built on Solana · connects to" />

                <Section title="Why Omukwano" sub="Designed for how people in Uganda actually pay.">
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
                </Section>
              </>
            )}

            {tab === 'services' && (
              <Section title="Services & store" sub="From salons and repairs to rides, food and shopping. If someone is paid for a job or an order, it fits.">
                <Services query={query} onQuery={setQuery} />
              </Section>
            )}

            {tab === 'dashboard' && (
              <Section title="Business dashboard" sub="Track deposits, payouts and your provider level in one place.">
                <Dashboard />
              </Section>
            )}

            {tab === 'pay' && (
              <Section title="Pay for a job" sub="Choose how you pay. Mobile money and card payments are collected by our payment partners.">
                <PayWidget />
              </Section>
            )}

            {tab === 'devnet' && (
              <Section title="Try it on devnet" sub="Connect a wallet to create your first on-chain account. No real money involved.">
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
              </Section>
            )}
          </div>

          <footer className="footer">
            <div className="brand"><img src={logo} alt="" /><span>Omukwano · Services &amp; Suppliers</span></div>
            <p>Built on Solana · Encode Club Solana Hackathon 2026</p>
          </footer>
        </div>
      </div>

      <RightRail onTab={go} />
    </>
  )
}

export default App
