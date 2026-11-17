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
import {
  ArrowRight,
  Banknote,
  MessageSquareText,
  Package,
  ShoppingBag,
  Ticket,
  Truck,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusBadge, RiskBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { channelMix, profitTrend } from '@/data/mock'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function DashboardPage() {
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const orders = useAppStore((s) => s.orders)
  const remittances = useAppStore((s) => s.remittances)
  const tickets = useAppStore((s) => s.tickets)

  const newOrders = orders.filter((o) => o.status === 'new')
  const toDispatch = orders.filter((o) => ['confirmed', 'packed'].includes(o.status))
  const unmatched = remittances.filter((r) => !r.matched)
  const openTickets = tickets.filter((tkt) => tkt.status === 'open' || tkt.status === 'in_progress')

  const doNext = [
    {
      step: 1,
      title: t('today.step1Title', { count: newOrders.length }),
      body: newOrders.length ? t('today.step1Body') : t('today.step1Empty'),
      href: newOrders.length ? '/app/orders?status=new' : '/app/orders/new',
      cta: newOrders.length ? t('today.step1Cta') : t('nav.quickOrder'),
      icon: MessageSquareText,
      tone: 'bg-cash/25 border-cash/40',
    },
    {
      step: 2,
      title: t('today.step2Title', { count: toDispatch.length }),
      body: toDispatch.length ? t('today.step2Body') : t('today.step2Empty'),
      href: '/app/dispatch',
      cta: t('today.step2Cta'),
      icon: Truck,
      tone: 'bg-lagoon/10 border-lagoon/25',
    },
    {
      step: 3,
      title: t('today.step3Title', { count: unmatched.length }),
      body: unmatched.length ? t('today.step3Body') : t('today.step3Empty'),
      href: '/app/cod',
      cta: t('today.step3Cta'),
      icon: Banknote,
      tone: 'bg-ok/10 border-ok/25',
    },
    {
      step: 4,
      title: t('today.step4Title', { count: openTickets.length }),
      body: openTickets.length ? t('today.step4Body') : t('today.step4Empty'),
      href: '/app/tickets',
      cta: t('today.step4Cta'),
      icon: Ticket,
      tone: 'bg-surface border-line',
    },
  ]

  const recentOrders = (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">{t('today.recent')}</h2>
        <Link to="/app/orders" className="text-sm font-semibold text-lagoon hover:underline">
          {t('today.allOrders')}
        </Link>
      </div>
      <div className="space-y-2">
        {orders.slice(0, 5).map((o) => (
          <Link
            key={o.id}
            to={`/app/orders/${o.id}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line/80 px-3 py-3 hover:bg-paper"
          >
            <div>
              <p className="text-sm font-semibold">
                {o.number} · {o.customerName}
              </p>
              <p className="text-xs text-muted">
                {o.channel} · {formatLkr(o.codAmount || o.subtotal + o.deliveryFee)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={o.riskLevel} />
              <OrderStatusBadge status={o.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader
        eyebrow={t('today.eyebrow')}
        title={t('today.title')}
        description={t('today.description')}
        tip={t('today.tip')}
        actions={
          <Button asChild variant="cash" className="min-h-11">
            <Link to="/app/orders/new">
              {t('nav.quickOrder')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        {doNext.map((item) => (
          <Link
            key={item.step}
            to={item.href}
            className={`group rounded-2xl border p-5 shadow-[var(--shadow-desk)] transition hover:-translate-y-0.5 ${item.tone}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-on-ink">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-display text-2xl font-extrabold text-ink/20">{item.step}</span>
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">{item.title}</h2>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lagoon group-hover:underline">
              {item.cta} <ArrowRight className="h-4 w-4" />
            </p>
          </Link>
        ))}
      </div>

      {simpleMode ? (
        <div className="mt-6">{recentOrders}</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            {recentOrders}

            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
                <h2 className="font-display text-lg font-bold">{t('today.profitWeek')}</h2>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={profitTrend}>
                      <defs>
                        <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--lagoon-bright)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="var(--lagoon-bright)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--line)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                      <YAxis hide />
                      <Tooltip formatter={(v) => formatLkr(Number(v))} />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="var(--lagoon)"
                        fill="url(#profitFill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
                <h2 className="font-display text-lg font-bold">{t('today.channels')}</h2>
                <div className="mt-3 space-y-2">
                  {channelMix.map((c) => (
                    <div key={c.channel} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-medium text-muted">{c.channel}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(c.orders / 86) * 100}%`, background: c.fill }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-semibold">{c.orders}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link to="/app/orders" className="rounded-xl border border-line bg-surface p-4 hover:bg-paper">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted">
                <ShoppingBag className="h-3.5 w-3.5" /> {t('nav.orders')}
              </p>
              <p className="mt-1 font-display text-lg font-bold">
                {t('today.inBook', { count: orders.length })}
              </p>
            </Link>
            <Link to="/app/dispatch" className="rounded-xl border border-line bg-surface p-4 hover:bg-paper">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted">
                <Package className="h-3.5 w-3.5" /> {t('nav.dispatch')}
              </p>
              <p className="mt-1 font-display text-lg font-bold">
                {t('today.toPack', { count: toDispatch.length })}
              </p>
            </Link>
            <Link to="/app/cod" className="rounded-xl border border-line bg-cash/20 p-4 hover:bg-cash/30">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-ink-soft">
                <Banknote className="h-3.5 w-3.5" /> {t('nav.money')}
              </p>
              <p className="mt-1 font-display text-lg font-bold">
                {t('today.unmatched', { count: unmatched.length })}
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
