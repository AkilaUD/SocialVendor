import { useMemo, useState } from 'react'
import { BigButton } from '@/components/kade/BigButton'
import { OrderTag } from '@/components/kade/OrderTag'
import { Road, statusToStop, type RoadStop } from '@/components/kade/Road'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { MessageSquareText } from 'lucide-react'

export function OrdersPage() {
  const t = useT()
  const orders = useAppStore((s) => s.orders)
  const [stop, setStop] = useState<RoadStop | 'all'>('all')

  const filtered = useMemo(() => {
    if (stop === 'all') return orders
    return orders.filter((o) => statusToStop(o.status) === stop)
  }, [orders, stop])

  const stampFor = (status: string) => {
    if (status === 'packed') return t('kade.stampPacked')
    if (status === 'dispatched') return t('kade.stampSent')
    if (status === 'delivered') return t('kade.stampDelivered')
    if (status === 'paid') return t('kade.stampPaid')
    if (status === 'rto' || status === 'returned') return t('kade.stampBack')
    return undefined
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{t('nav.parcels')}</h1>

      <Road
        current={stop === 'all' ? 'table' : stop}
        onSelect={(s) => setStop((prev) => (prev === s ? 'all' : s))}
        t={t}
      />

      <BigButton
        tone="primary"
        icon={<MessageSquareText className="h-7 w-7" />}
        speakText={t('nav.quickOrder')}
        to="/app/orders/new"
      >
        {t('nav.quickOrder')}
      </BigButton>

      <div className="space-y-3">
        {filtered.map((o) => (
          <OrderTag
            key={o.id}
            to={`/app/orders/${o.id}`}
            number={o.number}
            who={o.customerName}
            where={`${o.address.city}, ${o.address.district}`}
            amount={o.codAmount || o.subtotal + o.deliveryFee - o.discount}
            stamp={stampFor(o.status)}
            stampKind={o.status}
          />
        ))}
        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-ink bg-surface p-8 text-center">
            <p className="text-lg font-extrabold">{t('orders.empty')}</p>
            <p className="mt-2 text-muted">{t('empty.adjustSearch')}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
