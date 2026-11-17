import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { OrderStatusBadge, RiskBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { OrderStatus } from '@/types'
import { cn, formatLkr, formatPhone } from '@/lib/utils'

const filterIds: Array<'all' | OrderStatus> = [
  'all',
  'new',
  'confirmed',
  'on_hold',
  'packed',
  'dispatched',
  'delivered',
  'rto',
]

const statusIds = new Set(filterIds)

export function OrdersPage() {
  const t = useT()
  const orders = useAppStore((s) => s.orders)
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState('')
  const statusParam = searchParams.get('status')
  const status: 'all' | OrderStatus =
    statusParam && statusIds.has(statusParam as 'all' | OrderStatus)
      ? (statusParam as 'all' | OrderStatus)
      : 'all'

  const setStatus = (next: 'all' | OrderStatus) => {
    if (next === 'all') setSearchParams({})
    else setSearchParams({ status: next })
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = status === 'all' || o.status === status
      const hay = `${o.number} ${o.customerName} ${o.customerPhone} ${o.channel}`.toLowerCase()
      return matchStatus && hay.includes(q.toLowerCase())
    })
  }, [orders, q, status])

  return (
    <div>
      <PageHeader
        eyebrow={t('orders.eyebrow')}
        title={t('orders.title')}
        description={t('orders.description')}
        tip={t('orders.tip')}
        actions={
          <Button asChild variant="cash" className="min-h-11">
            <Link to="/app/orders/new">{t('nav.quickOrder')}</Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="min-h-11 pl-9"
            placeholder={t('orders.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex max-w-full gap-1 overflow-x-auto pb-1">
        {filterIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setStatus(id)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
              status === id ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-muted',
            )}
          >
            {id === 'all' ? t('common.all') : t(`status.${id}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t('orders.emptyTitle')}
          description={t('orders.emptyBody')}
          actionLabel={t('nav.quickOrder')}
          onAction={() => {
            window.location.href = '/app/orders/new'
          }}
        />
      ) : (
        <div className="rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
          <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-3 border-b border-line bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>{t('orders.title')}</span>
            <span>{t('nav.customers')}</span>
            <span>{t('nav.cod')}</span>
            <span>{t('quickOrder.risk')}</span>
            <span>Status</span>
          </div>
          {filtered.map((o) => (
            <Link
              key={o.id}
              to={`/app/orders/${o.id}`}
              className="grid gap-2 border-b border-line/70 px-4 py-3 last:border-0 hover:bg-paper lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-center lg:gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">{o.number}</p>
                <p className="text-xs text-muted capitalize">
                  {o.channel} · {new Date(o.createdAt).toLocaleString('en-LK')}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{o.customerName}</p>
                <p className="text-xs text-muted">{formatPhone(o.customerPhone)}</p>
              </div>
              <p className="text-sm font-semibold lg:text-right">
                {formatLkr(o.codAmount || o.subtotal + o.deliveryFee - o.discount)}
              </p>
              <div className="flex flex-wrap items-center gap-2 lg:contents">
                <RiskBadge level={o.riskLevel} />
                <OrderStatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
