import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BigButton } from '@/components/kade/BigButton'
import { OrderTag } from '@/components/kade/OrderTag'
import { Pictogram } from '@/components/kade/Pictogram'
import { Purse } from '@/components/kade/Purse'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { channelMix, profitTrend } from '@/data/mock'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function DashboardPage() {
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const tenant = useAppStore((s) => s.tenant)
  const orders = useAppStore((s) => s.orders)
  const remittances = useAppStore((s) => s.remittances)
  const expenses = useAppStore((s) => s.expenses)

  const toPack = orders.filter((o) => ['confirmed', 'packed'].includes(o.status))
  const onRoad = orders.filter((o) => o.status === 'dispatched')
  const unmatched = remittances.filter((r) => !r.matched)
  const owed = unmatched.reduce((s, r) => s + r.amount, 0)
  const weekIn = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((s, o) => s + (o.codAmount || o.subtotal), 0)
  const weekOut = expenses.reduce((s, e) => s + e.amount, 0)
  const kept = Math.max(0, weekIn - weekOut)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-extrabold text-muted">{tenant.businessName}</p>
          <p className="text-sm text-muted">
            {t('today.hi', { name: tenant.ownerName.split(' ')[0] })}
          </p>
        </div>
        <SpeakButton
          text={`${t('moneyUi.hearKept')} ${formatLkr(kept)}`}
          label={t('moneyUi.hearKept')}
        />
      </div>

      <Purse amount={kept} label={t('today.kept')} />

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/app/dispatch"
          className="parcel-tag block p-4 active:translate-y-px"
        >
          <Pictogram id="parcel" className="h-12 w-12" />
          <p className="mt-2 font-money text-3xl">{toPack.length}</p>
          <p className="text-base font-extrabold">{t('today.toPackTag')}</p>
        </Link>
        <Link to="/app/orders" className="parcel-tag block p-4 active:translate-y-px">
          <Pictogram id="bike" className="h-12 w-12" />
          <p className="mt-2 font-money text-3xl">{onRoad.length}</p>
          <p className="text-base font-extrabold">{t('today.onRoadTag')}</p>
        </Link>
      </div>

      <Link
        to="/app/cod"
        className="flex items-center gap-3 rounded-xl border-2 border-ink bg-surface p-4 active:translate-y-px"
      >
        <Pictogram id="bike" className="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold">{t('today.owe')}</p>
          <p className="font-money text-2xl">{formatLkr(owed)}</p>
          <p className="text-sm text-muted">{t('today.unmatched', { count: unmatched.length })}</p>
        </div>
      </Link>

      <BigButton to="/app/orders/new" icon={<Pictogram id="chat" />} speakText={t('today.newOrder')}>
        {t('today.newOrder')}
      </BigButton>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{t('today.recent')}</h2>
          <Link to="/app/orders" className="text-sm font-extrabold text-lagoon">
            {t('today.allOrders')}
          </Link>
        </div>
        {orders.slice(0, 4).map((o) => (
          <OrderTag
            key={o.id}
            to={`/app/orders/${o.id}`}
            number={o.number}
            who={o.customerName}
            where={o.address.city}
            amount={o.codAmount || o.subtotal + o.deliveryFee - o.discount}
            stamp={o.status === 'paid' ? t('stamp.paid') : undefined}
            stampKind={o.status === 'paid' ? 'paid' : undefined}
          />
        ))}
      </div>

      {!simpleMode ? (
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border-2 border-ink bg-surface p-4">
            <h2 className="text-lg font-extrabold">{t('today.profitWeek')}</h2>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitTrend}>
                  <CartesianGrid stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                  <YAxis hide />
                  <Tooltip formatter={(v) => formatLkr(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--lagoon)"
                    fill="var(--cash)"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border-2 border-ink bg-surface p-4">
            <h2 className="text-lg font-extrabold">{t('today.channels')}</h2>
            <div className="mt-3 space-y-2">
              {channelMix.map((c) => (
                <div key={c.channel} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-extrabold text-muted">{c.channel}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full border border-ink bg-paper-2">
                    <div
                      className="h-full bg-lagoon"
                      style={{ width: `${(c.orders / 86) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-money text-sm">{c.orders}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
