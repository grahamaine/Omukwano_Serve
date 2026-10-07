import { useState } from 'react'
import './Services.css'

type Group = 'Services' | 'Store'

type Category = { ref: string; name: string; text: string; group: Group }

// `ref` is the public reference stored on each job and shown in the SMS code, e.g. OMK-HAIR-483920.
export const CATEGORIES: Category[] = [
  { ref: 'HAIR', name: 'Beauty & barber', text: 'Salons, barbers, braiding, nails and spas.', group: 'Services' },
  { ref: 'REPR', name: 'Repairs & fundis', text: 'Electricians, plumbers, phone and appliance repair.', group: 'Services' },
  { ref: 'CLEN', name: 'Cleaning', text: 'Home, office and laundry services.', group: 'Services' },
  { ref: 'BUIL', name: 'Construction', text: 'Small builds, painting, fit-outs and materials jobs.', group: 'Services' },
  { ref: 'HLTH', name: 'Health & wellness', text: 'Clinics, pharmacies, fitness and massage.', group: 'Services' },
  { ref: 'EDUC', name: 'Tutoring & training', text: 'Lessons, courses and workshops.', group: 'Services' },
  { ref: 'EVNT', name: 'Events', text: 'Photographers, caterers, decor and sound.', group: 'Services' },
  { ref: 'RIDE', name: 'Rides & boda', text: 'Pay for a trip, release when you arrive.', group: 'Store' },
  { ref: 'FOOD', name: 'Food orders', text: 'Restaurants and kitchens. Pay on delivery.', group: 'Store' },
  { ref: 'DLVR', name: 'Courier & delivery', text: 'Parcels and errands, paid when received.', group: 'Store' },
  { ref: 'SHOP', name: 'Shops & retail', text: 'General merchandise from local sellers.', group: 'Store' },
  { ref: 'GOOD', name: 'Other goods', text: 'Anything sold in person or online.', group: 'Store' },
]

export function Services() {
  const [group, setGroup] = useState<Group>('Services')
  const list = CATEGORIES.filter((c) => c.group === group)

  return (
    <div className="services">
      <div className="tabs" role="tablist">
        {(['Services', 'Store'] as Group[]).map((g) => (
          <button key={g} role="tab" aria-selected={group === g} className={group === g ? 'tab on' : 'tab'} onClick={() => setGroup(g)}>
            {g === 'Services' ? 'Local services' : 'Store: rides, food & goods'}
          </button>
        ))}
      </div>

      <div className="grid grid-4">
        {list.map((c) => (
          <article className="card cat" key={c.ref}>
            <span className="ref">{c.ref}</span>
            <h3>{c.name}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>

      <p className="code-note">
        Every job carries one of these references. The customer’s confirmation SMS looks like <code>OMK-HAIR-483920</code>.
      </p>
    </div>
  )
}
