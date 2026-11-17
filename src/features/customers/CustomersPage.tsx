import { Link } from 'react-router-dom'
import { Check, Hand } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { cn, formatPhone } from '@/lib/utils'

export function CustomersPage() {
  const t = useT()
  const customers = useAppStore((s) => s.customers)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{t('nav.customers')}</h1>

      <div className="space-y-2">
        {customers.map((c) => {
          const safe = c.riskLevel === 'low'
          const careful = c.riskLevel === 'high'
          return (
            <Link
              key={c.id}
              to={`/app/customers/${c.id}`}
              className="flex min-h-16 items-center gap-3 rounded-xl border-2 border-ink bg-surface px-3 py-3 active:translate-y-px"
            >
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink',
                  safe && 'bg-ok text-white',
                  careful && 'bg-risk text-white',
                  !safe && !careful && 'bg-cash text-ink',
                )}
              >
                {careful ? <Hand className="h-6 w-6" /> : <Check className="h-6 w-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold">{c.name}</p>
                <p className="text-sm text-muted">{formatPhone(c.phone)}</p>
              </div>
              <p className="shrink-0 text-sm font-extrabold text-muted">
                {safe ? t('status.low') : careful ? t('status.high') : t('status.medium')}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
