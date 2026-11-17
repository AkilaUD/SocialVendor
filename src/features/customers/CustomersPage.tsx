import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { RiskBadge } from '@/components/common/StatusBadge'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { RiskLevel } from '@/types'
import { cn, formatLkr, formatPhone } from '@/lib/utils'

export function CustomersPage() {
  const t = useT()
  const customers = useAppStore((s) => s.customers)
  const [q, setQ] = useState('')
  const [risk, setRisk] = useState<'all' | RiskLevel>('all')

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        const hay = `${c.name} ${c.phone} ${c.tags.join(' ')}`.toLowerCase()
        return (risk === 'all' || c.riskLevel === risk) && hay.includes(q.toLowerCase())
      }),
    [customers, q, risk],
  )

  return (
    <div>
      <PageHeader
        eyebrow={t('customers.eyebrow')}
        title={t('customers.title')}
        description={t('customers.description')}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="min-h-11 pl-9" placeholder={t('customers.search')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex max-w-full gap-1 overflow-x-auto pb-1">
          {(['all', 'low', 'medium', 'high'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRisk(r)}
              className={cn(
                'min-h-11 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize',
                risk === r ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-muted',
              )}
            >
              {r === 'all' ? t('common.all') : t(`status.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title={t('customers.empty')} description={t('empty.adjustSearch')} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/app/customers/${c.id}`}
              className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-desk)] hover:border-lagoon/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{c.name}</p>
                  <p className="text-sm text-muted">{formatPhone(c.phone)}</p>
                </div>
                <RiskBadge level={c.riskLevel} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-paper p-2">
                  <p className="text-[10px] uppercase text-muted">Orders</p>
                  <p className="font-semibold">{c.orderCount}</p>
                </div>
                <div className="rounded-lg bg-paper p-2">
                  <p className="text-[10px] uppercase text-muted">RTO</p>
                  <p className="font-semibold">{c.rtoCount}</p>
                </div>
                <div className="rounded-lg bg-paper p-2">
                  <p className="text-[10px] uppercase text-muted">LTV</p>
                  <p className="text-xs font-semibold">{formatLkr(c.lifetimeValue)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
