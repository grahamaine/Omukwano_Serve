import { useState } from 'react'
import { Scissors, Wrench, Sparkles, HardHat, HeartPulse, GraduationCap, PartyPopper, Bike, UtensilsCrossed, Truck, ShoppingBag, Package, type LucideIcon } from 'lucide-react'
import './Services.css'

type Group = 'Services' | 'Store'

type Category = { ref: string; name: string; text: string; group: Group; Icon: LucideIcon }

// `ref` is the public reference stored on each job and shown in the SMS code, e.g. OMK-HAIR-483920.
export const CATEGORIES: Category[] = [
  { ref: 'HAIR', name: 'Beauty & barber', text: 'Salons, barbers, braiding, nails and spas.', group: 'Services', Icon: Scissors },
  { ref: 'REPR', name: 'Repairs & fundis', text: 'Electricians, plumbers, phone and appliance repair.', group: 'Services', Icon: Wrench },
  { ref: 'CLEN', name: 'Cleaning', text: 'Home, office and laundry services.', group: 'Services', Icon: Sparkles },
  { ref: 'BUIL', name: 'Construction', text: 'Small builds, painting, fit-outs and materials jobs.', group: 'Services', Icon: HardHat },
  { ref: 'HLTH', name: 'Health & wellness', text: 'Clinics, pharmacies, fitness and massage.', group: 'Services', Icon: HeartPulse },
  { ref: 'EDUC', name: 'Tutoring & training', text: 'Lessons, courses and workshops.', group: 'Services', Icon: GraduationCap },
  { ref: 'EVNT', name: 'Events', text: 'Photographers, caterers, decor and sound.', group: 'Services', Icon: PartyPopper },
  { ref: 'RIDE', name: 'Rides & boda', text: 'Pay for a trip, release when you arrive.', group: 'Store', Icon: Bike },
  { ref: 'FOOD', name: 'Food orders', text: 'Restaurants and kitchens. Pay on delivery.', group: 'Store', Icon: UtensilsCrossed },
  { ref: 'DLVR', name: 'Courier & delivery', text: 'Parcels and errands, paid when received.', group: 'Store', Icon: Truck },
  { ref: 'SHOP', name: 'Shops & retail', text: 'General merchandise from local sellers.', group: 'Store', Icon: ShoppingBag },
  { ref: 'GOOD', name: 'Other goods', text: 'Anything sold in person or online.', group: 'Store', Icon: Package },
]

export function Services({ query = '', onQuery }: { query?: string; onQuery?: (q: string) => void }) {
  const [group, setGroup] = useState<Group>('Services')
  const q = query.trim().toLowerCase()
  const list = q
    ? CATEGORIES.filter((c) => `${c.ref} ${c.name} ${c.text}`.toLowerCase().includes(q))
    : CATEGORIES.filter((c) => c.group === group)

  return (
    <div className="services">
      {onQuery && (
        <div className="svc-search">
          <input placeholder="Filter services, e.g. hair, food, repair" value={query} onChange={(e) => onQuery(e.target.value)} />
          {query && <button onClick={() => onQuery('')}>Clear</button>}
        </div>
      )}
      <div className="tabs" role="tablist" hidden={!!q}>
        {(['Services', 'Store'] as Group[]).map((g) => (
          <button key={g} role="tab" aria-selected={group === g} className={group === g ? 'tab on' : 'tab'} onClick={() => setGroup(g)}>
            {g === 'Services' ? 'Local services' : 'Store: rides, food & goods'}
          </button>
        ))}
      </div>

      {q && list.length === 0 && <p className="code-note">No service matches “{query}”.</p>}
      <div className="grid grid-wide">
        {list.map((c) => (
          <article className="card wide cat" key={c.ref}>
            <span className="ico"><c.Icon size={26} strokeWidth={1.8} /></span>
            <div className="body">
              <h3>{c.name} <span className="ref">{c.ref}</span></h3>
              <p>{c.text}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="code-note">
        Every job carries one of these references. The customer’s confirmation SMS looks like <code>OMK-HAIR-483920</code>.
      </p>
    </div>
  )
}
