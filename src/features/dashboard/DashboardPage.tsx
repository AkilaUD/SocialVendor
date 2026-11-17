import { Link } from 'react-router-dom'
import { Bike, MessageSquareText, Package, ShoppingBag } from 'lucide-react'
import { BigButton } from '@/components/kade/BigButton'
import { OrderTag } from '@/components/kade/OrderTag'
import { Purse } from '@/components/kade/Purse'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function DashboardPage() {
  const t = useT()
  const tenant = useAppStore((s) => s.tenant)
  const orders = useAppStore((s) => s.orders)
  const remittances = useAppStore((s) => s.remittances)
  const expenses = useAppStore((s) => s.expenses)

  const toPack = orders.filter((o) => ['confirmed', 'new'].includes(o.status))
  const onRoad = orders.filter((o) => ['packed', 'dispatched'].includes(o.status))
  const unmatched = remittances.filter((r) => !r.matched)
  const owe = unmatched.reduce((s, r) => s + r.amount, 0)
  const cameIn = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.codAmount, 0)
  const wentOut = expenses.reduce((s, e) => s + e.amount, 0)
  const kept = Math.max(0, cameIn - wentOut)

  const shopName = tenant.businessName || tenant.ownerName
  const keptLine = t('kade.todayKept')

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-muted">{shopName}</p>
          <h1 className="font-display text-2xl font-extrabold text-ink">{keptLine}</h1>
        </div>
        <SpeakButton text={`${keptLine} ${formatLkr(kept)}`} label={t('kade.hearIt')} />
      </div>

      <Purse amount={kept} label={t('kade.youKept')} />

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/app/dispatch"
          className="parcel-tag flex min-h-28 flex-col justify-between p-4 active:translate-y-px"
        >
          <Package className="h-8 w-8 text-lagoon" strokeWidth={2.5} />
          <div>
            <p className="font-money text-3xl">{toPack.length}</p>
            <p className="text-sm font-extrabold">{t('kade.toPack')}</p>
          </div>
        </Link>
        <Link
          to="/app/orders"
          className="parcel-tag flex min-h-28 flex-col justify-between p-4 active:translate-y-px"
        >
          <Bike className="h-8 w-8 text-lagoon" strokeWidth={2.5} />
          <div>
            <p className="font-money text-3xl">{onRoad.length}</p>
            <p className="text-sm font-extrabold">{t('kade.onRoad')}</p>
          </div>
        </Link>
      </div>

      <BigButton
        tone="board"
        icon={<Bike className="h-7 w-7" />}
        speakText={`${t('kade.couriersOwe')} ${formatLkr(owe)}`}
        to="/app/cod"
      >
        {`${t('kade.couriersOwe')} · ${formatLkr(owe)}`}
      </BigButton>

      <BigButton
        tone="primary"
        icon={<MessageSquareText className="h-7 w-7" />}
        speakText={t('nav.quickOrder')}
        to="/app/orders/new"
      >
        {t('nav.quickOrder')}
      </BigButton>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <p className="font-extrabold">{t('nav.parcels')}</p>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map((o) => (
            <OrderTag
              key={o.id}
              to={`/app/orders/${o.id}`}
              number={o.number}
              who={o.customerName}
              where={o.address.city}
              amount={o.codAmount || o.subtotal}
              stamp={o.status === 'paid' ? t('kade.stampPaid') : undefined}
              stampKind={o.status === 'paid' ? 'paid' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
