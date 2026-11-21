import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { BigButton } from '@/components/kade/BigButton'
import { OrderTag } from '@/components/kade/OrderTag'
import { Pictogram } from '@/components/kade/Pictogram'
import { Road, statusToStop, type RoadStop } from '@/components/kade/Road'
import { EmptyState } from '@/components/common/EmptyState'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { useT } from '@/i18n'
import type { OrderStatus } from '@/types'
import { ShoppingBag } from 'lucide-react'

const stopToStatuses: Record<RoadStop, OrderStatus[] | 'all'> = {
  table: ['new', 'on_hold', 'confirmed'],
  bag: ['packed'],
  bike: ['dispatched'],
  door: ['delivered', 'rto', 'returned', 'cancelled'],
  money: ['paid'],
}

function stampFor(status: OrderStatus, t: (k: string) => string) {
  if (status === 'packed') return { label: t('stamp.packed'), kind: 'packed' }
  if (status === 'dispatched') return { label: t('stamp.sent'), kind: 'sent' }
  if (status === 'delivered') return { label: t('stamp.delivered'), kind: 'delivered' }
  if (status === 'paid') return { label: t('stamp.paid'), kind: 'paid' }
  if (status === 'rto' || status === 'returned') return { label: t('stamp.returned'), kind: 'returned' }
  if (status === 'confirmed') return { label: t('stamp.confirmed'), kind: 'confirmed' }
  return undefined
}

export function OrdersPage() {
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const orders = useAppStore((s) => s.orders)
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [showFind, setShowFind] = useState(false)
  const roadParam = searchParams.get('road') as RoadStop | null
  const currentRoad: RoadStop = roadParam && roadParam in stopToStatuses ? roadParam : 'table'
  const filterAll = !roadParam

  const setRoad = (stop: RoadStop) => {
    setSearchParams({ road: stop })
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const statuses = filterAll ? 'all' : stopToStatuses[currentRoad]
      const matchRoad =
        statuses === 'all' || (Array.isArray(statuses) && statuses.includes(o.status))
      const hay = `${o.number} ${o.customerName} ${o.customerPhone} ${o.channel}`.toLowerCase()
      return matchRoad && hay.includes(q.toLowerCase())
    })
  }, [orders, q, currentRoad, filterAll])

  // When opening /app/orders with ?status=new from old links, still work
  const statusParam = searchParams.get('status')
  const legacyFiltered = useMemo(() => {
    if (!statusParam) return null
    return orders.filter((o) => {
      const matchStatus = o.status === statusParam
      const hay = `${o.number} ${o.customerName} ${o.customerPhone}`.toLowerCase()
      return matchStatus && hay.includes(q.toLowerCase())
    })
  }, [orders, q, statusParam])

  const list = legacyFiltered ?? filtered

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{t('orders.title')}</h1>
          {!simpleMode ? (
            <p className="text-base text-muted">{t('orders.description')}</p>
          ) : null}
        </div>
      </div>

      {!simpleMode ? (
        <BigButton to="/app/orders/new" icon={<Pictogram id="chat" />} speakText={t('today.newOrder')}>
          {t('today.newOrder')}
        </BigButton>
      ) : null}

      <Road
        current={statusParam ? statusToStop(statusParam) : filterAll ? 'table' : currentRoad}
        onSelect={setRoad}
        t={t}
      />

      {simpleMode && !showFind ? (
        <button
          type="button"
          onClick={() => setShowFind(true)}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-3 font-extrabold active:translate-y-px"
        >
          <Pictogram id="hand" className="h-10 w-10" />
          {t('simple.find')}
        </button>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <Input
            className="min-h-14 border-2 border-ink pl-10 text-base"
            placeholder={t('orders.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus={simpleMode && showFind}
          />
        </div>
      )}

      {list.length === 0 ? (
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
        <div className="space-y-3">
          {list.map((o) => {
            const stamp = stampFor(o.status, t)
            return (
              <OrderTag
                key={o.id}
                to={`/app/orders/${o.id}`}
                number={o.number}
                who={o.customerName}
                where={o.address.city}
                amount={o.codAmount || o.subtotal + o.deliveryFee - o.discount}
                stamp={stamp?.label}
                stampKind={stamp?.kind}
              />
            )
          })}
        </div>
      )}

      {!statusParam ? (
        <button
          type="button"
          className="text-sm font-extrabold text-lagoon"
          onClick={() => setSearchParams({})}
        >
          {t('common.all')}
        </button>
      ) : (
        <Link to="/app/orders" className="text-sm font-extrabold text-lagoon">
          {t('common.all')}
        </Link>
      )}
    </div>
  )
}
