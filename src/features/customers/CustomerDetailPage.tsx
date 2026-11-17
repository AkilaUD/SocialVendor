import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusBadge, RiskBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr, formatPhone } from '@/lib/utils'

export function CustomerDetailPage() {
  const t = useT()
  const { id } = useParams()
  const customer = useAppStore((s) => s.customers.find((c) => c.id === id))
  const orders = useAppStore((s) => s.orders.filter((o) => o.customerId === id))

  if (!customer) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold">{t('customers.empty')}</p>
        <Button asChild className="mt-4 min-h-11" variant="outline">
          <Link to="/app/customers">{t('common.back')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 min-h-10">
        <Link to="/app/customers">
          <ArrowLeft className="h-4 w-4" /> {t('customers.title')}
        </Link>
      </Button>
      <PageHeader
        title={customer.name}
        description={formatPhone(customer.phone)}
        actions={<RiskBadge level={customer.riskLevel} />}
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">Profile</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Risk score</dt>
                <dd className="font-semibold">{customer.riskScore}/100</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Lifetime value</dt>
                <dd className="font-semibold">{formatLkr(customer.lifetimeValue)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Marketing</dt>
                <dd>{customer.marketingOptIn ? 'Opted in' : 'Opted out'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Tags</dt>
                <dd>{customer.tags.join(', ')}</dd>
              </div>
            </dl>
            {customer.notes ? (
              <p className="mt-4 rounded-lg bg-cash/15 p-3 text-sm">{customer.notes}</p>
            ) : null}
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">Addresses</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {customer.addresses.map((a, i) => (
                <li key={i} className="rounded-lg bg-paper p-3">
                  {a.line1}
                  <br />
                  {a.city}, {a.district}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <h2 className="font-display text-lg font-bold">Order history</h2>
          <div className="mt-3 space-y-2">
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No orders linked in demo data.</p>
            ) : (
              orders.map((o) => (
                <Link
                  key={o.id}
                  to={`/app/orders/${o.id}`}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-3 hover:bg-paper"
                >
                  <div>
                    <p className="text-sm font-semibold">{o.number}</p>
                    <p className="text-xs text-muted">{formatLkr(o.codAmount || o.subtotal)}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
