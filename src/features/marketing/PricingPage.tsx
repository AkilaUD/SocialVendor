import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n'
import { cn, formatLkr } from '@/lib/utils'

const tiers = [
  {
    name: 'Free',
    price: 0,
    limit: '50 orders · 1 user',
    features: ['Orders & buyers', 'Stock & bills', 'Parcel numbers', 'English / Sinhala / Tamil'],
    highlight: false,
  },
  {
    name: 'Starter',
    price: 2490,
    limit: '500 orders · 2 users',
    features: ['Courier links', 'Cash at door ticks', 'Parcels that came back', 'Costs & profit'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: 5990,
    limit: '2,000 orders · 5 users',
    features: ['Inbox (Phase 2)', 'BOM & purchasing', 'Tickets & reviews', 'Android app'],
    highlight: true,
  },
  {
    name: 'Pro',
    price: 12990,
    limit: 'Higher volume · 15 users',
    features: ['Daraz sync', 'Partner API', 'Multi-location', 'Priority support'],
    highlight: false,
  },
]

export function PricingPage() {
  const t = useT()
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">{t('marketing.pricing')}</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-ink">{t('marketing.pricing')}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Messaging costs pass through at Meta / SMS rates. No USD sticker shock for a Colombo packing desk.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'flex flex-col rounded-2xl border p-5 shadow-[var(--shadow-desk)]',
              tier.highlight ? 'border-lagoon bg-ink text-on-ink' : 'border-line bg-surface',
            )}
          >
            <p className={cn('text-sm font-semibold', tier.highlight ? 'text-cash' : 'text-lagoon')}>{tier.name}</p>
            <p className="mt-3 font-display text-3xl font-bold">
              {tier.price === 0 ? 'Free' : formatLkr(tier.price)}
              {tier.price > 0 ? <span className="text-sm font-medium opacity-70"> / mo</span> : null}
            </p>
            <p className={cn('mt-1 text-sm', tier.highlight ? 'text-mint/60' : 'text-muted')}>{tier.limit}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={cn('mt-0.5 h-4 w-4 shrink-0', tier.highlight ? 'text-cash' : 'text-lagoon')} />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 min-h-11" variant={tier.highlight ? 'cash' : 'lagoon'}>
              <Link to="/register">
                {tier.price === 0 ? t('common.startFree') : tier.name}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
