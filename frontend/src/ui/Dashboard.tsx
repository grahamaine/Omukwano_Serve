import './Dashboard.css'

type JobStatus = 'Locked' | 'In progress' | 'Awaiting code' | 'Released'

type DemoJob = { id: string; service: string; customer: string; amount: number; status: JobStatus }

// Demo data only. Replace with accounts read from the escrow program once it exists.
const DEMO_JOBS: DemoJob[] = [
  { id: 'J-1042', service: 'Braids + wash', customer: 'Customer ••41', amount: 45, status: 'Locked' },
  { id: 'J-1041', service: 'Shop shelving repair', customer: 'Customer ••17', amount: 120, status: 'In progress' },
  { id: 'J-1040', service: 'Bulk soap delivery', customer: 'Retailer ••08', amount: 310, status: 'Awaiting code' },
  { id: 'J-1039', service: 'Haircut', customer: 'Customer ••62', amount: 12, status: 'Released' },
]

const LEVELS = [
  { name: 'Bronze', from: 0 },
  { name: 'Silver', from: 10 },
  { name: 'Gold', from: 30 },
  { name: 'Diamond', from: 75 },
]

function levelFor(completed: number) {
  const idx = LEVELS.reduce((acc, l, i) => (completed >= l.from ? i : acc), 0)
  const next = LEVELS[idx + 1]
  return { current: LEVELS[idx], next, progress: next ? (completed - LEVELS[idx].from) / (next.from - LEVELS[idx].from) : 1 }
}

const EMBED = `<a href="https://omukwano.app/pay/YOUR-BUSINESS"
   class="omukwano-pay">Pay with Omukwano</a>`

export function Dashboard() {
  const completed = DEMO_JOBS.filter((j) => j.status === 'Released').length
  const locked = DEMO_JOBS.filter((j) => j.status !== 'Released').reduce((s, j) => s + j.amount, 0)
  const released = DEMO_JOBS.filter((j) => j.status === 'Released').reduce((s, j) => s + j.amount, 0)
  const { current, next, progress } = levelFor(completed)

  const stats = [
    { label: 'Funds in escrow', value: `${locked} USDC` },
    { label: 'Paid out', value: `${released} USDC` },
    { label: 'Jobs completed', value: String(completed) },
    { label: 'Open jobs', value: String(DEMO_JOBS.length - completed) },
  ]

  return (
    <div className="dash">
      <p className="demo-note">Demo data. This panel will read real jobs from the escrow program once it is deployed.</p>

      <div className="dash-stats">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>

      <div className="dash-cols">
        <div className="card jobs">
          <h3>Your jobs</h3>
          <table>
            <thead>
              <tr><th>Job</th><th>Service</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {DEMO_JOBS.map((j) => (
                <tr key={j.id}>
                  <td data-label="Job">{j.id}</td>
                  <td data-label="Service">{j.service}<small>{j.customer}</small></td>
                  <td data-label="Amount">{j.amount} USDC</td>
                  <td data-label="Status"><span className={`chip chip-${j.status.replace(' ', '-').toLowerCase()}`}>{j.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dash-side">
          <div className="card">
            <h3>Provider level</h3>
            <p className="level"><span className="badge">{current.name}</span>{next ? ` · ${next.from - completed} more jobs to ${next.name}` : ' · top level'}</p>
            <div className="bar"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
          </div>
          <div className="card">
            <h3>“Pay with Omukwano” button</h3>
            <p>Paste this on your website or share the link on WhatsApp.</p>
            <pre>{EMBED}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
