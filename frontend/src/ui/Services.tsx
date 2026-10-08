import { useState } from 'react'
import { Scissors, Wrench, Sparkles, HardHat, HeartPulse, GraduationCap, PartyPopper, Bike, UtensilsCrossed, Truck, ShoppingBag, Package, Landmark, Wifi, Code, Building2, Scale, Compass, BedDouble, ShoppingBasket, Laptop, Zap, Pill, type LucideIcon } from 'lucide-react'
import './Services.css'

type Group = 'Services' | 'Store'

type Category = { ref: string; name: string; text: string; group: Group; Icon: LucideIcon }

// `ref` is the public reference stored on each job and shown in the SMS code, e.g. PMJ-HAIR-483920.
export const CATEGORIES: Category[] = [
  // Services rendered
  { ref: 'HAIR', name: 'Beauty & barber', text: 'Salons, barbers, braiding, nails and spas.', group: 'Services', Icon: Scissors },
  { ref: 'REPR', name: 'Repairs & fundis', text: 'Electricians, plumbers, phone and appliance repair.', group: 'Services', Icon: Wrench },
  { ref: 'CLEN', name: 'Cleaning', text: 'Home, office and laundry services.', group: 'Services', Icon: Sparkles },
  { ref: 'BUIL', name: 'Construction', text: 'Small builds, painting, fit-outs and materials jobs.', group: 'Services', Icon: HardHat },
  { ref: 'REAL', name: 'Real estate & property', text: 'Leasing, property maintenance and brokerage.', group: 'Services', Icon: Building2 },
  { ref: 'PROF', name: 'Professional services', text: 'Accounting, legal, IT support, recruitment and call-centre outsourcing.', group: 'Services', Icon: Scale },
  { ref: 'DIGI', name: 'Digital & software', text: 'Web design, software development and digital marketing.', group: 'Services', Icon: Code },
  { ref: 'TELE', name: 'Telecom & internet', text: 'Internet service providers, airtime and data distribution.', group: 'Services', Icon: Wifi },
  { ref: 'MOMO', name: 'Mobile money & banking', text: 'Agents, merchant pay points, transfers and bill-payment services.', group: 'Services', Icon: Landmark },
  { ref: 'TOUR', name: 'Tours & safaris', text: 'Tour operators, safari guides and travel planning.', group: 'Services', Icon: Compass },
  { ref: 'STAY', name: 'Hotels & lodges', text: 'Hotel, lodge and guesthouse bookings.', group: 'Services', Icon: BedDouble },
  { ref: 'EVNT', name: 'Events', text: 'Planners, photographers, caterers, decor and sound.', group: 'Services', Icon: PartyPopper },
  { ref: 'HLTH', name: 'Health & wellness', text: 'Clinics, fitness, massage and home lab-sample collection.', group: 'Services', Icon: HeartPulse },
  { ref: 'EDUC', name: 'Tutoring & training', text: 'Lessons, courses and workshops.', group: 'Services', Icon: GraduationCap },
  // Orders and deliveries
  { ref: 'FOOD', name: 'Food & restaurants', text: 'Local dishes, fast food and cafes. Pay when it arrives.', group: 'Store', Icon: UtensilsCrossed },
  { ref: 'GROC', name: 'Groceries & fresh produce', text: 'Farm produce, daily essentials, meat and household goods.', group: 'Store', Icon: ShoppingBasket },
  { ref: 'ELEC', name: 'Electronics & fashion', text: 'Phones, laptops, appliances, clothing and home decor.', group: 'Store', Icon: Laptop },
  { ref: 'SHOP', name: 'Shops & retail', text: 'General merchandise from local sellers.', group: 'Store', Icon: ShoppingBag },
  { ref: 'RIDE', name: 'Rides & boda', text: 'Boda-boda and cab rides. Pay for a trip, release when you arrive.', group: 'Store', Icon: Bike },
  { ref: 'DLVR', name: 'Courier & freight', text: 'Parcel pick-up and drop-off, errands and regional logistics.', group: 'Store', Icon: Truck },
  { ref: 'UTIL', name: 'Utilities & bills', text: 'Electricity tokens, water bills, TV subscriptions, airtime and data bundles.', group: 'Store', Icon: Zap },
  { ref: 'PHAR', name: 'Pharmacy & tele-health', text: 'Prescription refills, over-the-counter medicine and doctor consultations.', group: 'Store', Icon: Pill },
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
            {g === 'Services' ? 'Services rendered' : 'Orders & deliveries'}
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
        Every job carries one of these references. The customer’s confirmation SMS looks like <code>PMJ-HAIR-483920</code>.
      </p>
    </div>
  )
}
