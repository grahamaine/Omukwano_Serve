import { CHAINS, type Chain } from './chains'
import './ChainMarquee.css'

// Auto-scrolling logo strip. Pass your own `chains` to reuse it in any app.
export function ChainMarquee({ chains = CHAINS, title = 'Supported chains' }: { chains?: Chain[]; title?: string }) {
  const row = [...chains, ...chains] // doubled so the loop is seamless
  return (
    <section className="marquee" aria-label={title}>
      <p className="marquee-title">{title}</p>
      <div className="marquee-viewport">
        <ul className="marquee-track">
          {row.map(({ name, Icon }, i) => (
            <li key={`${name}-${i}`} className="marquee-item" aria-hidden={i >= chains.length}>
              <Icon size={32} variant="branded" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
