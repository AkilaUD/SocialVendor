import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Building2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusBadge, RiskBadge } from '@/components/common/StatusBadge'
import { BankSlipDialog } from '@/components/payments/BankSlipDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { OrderStatus } from '@/types'
import { formatLkr, formatPhone } from '@/lib/utils'

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'confirmed',
  on_hold: 'confirmed',
  confirmed: 'packed',
  packed: 'dispatched',
  dispatched: 'delivered',
  delivered: 'paid',
}

const nextLabelKeys: Partial<Record<OrderStatus, string>> = {
  new: 'orderDetail.confirm',
  on_hold: 'orderDetail.markAdvance',
  confirmed: 'orderDetail.markPacked',
  packed: 'orderDetail.createWaybill',
  dispatched: 'orderDetail.markDelivered',
  delivered: 'orderDetail.closePaid',
}

export function OrderDetailPage() {
  const t = useT()
  const { id } = useParams()
  const orders = useAppStore((s) => s.orders)
  const bankPayments = useAppStore((s) => s.bankPayments)
  const tenant = useAppStore((s) => s.tenant)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)
  const order = orders.find((o) => o.id === id)
  const [slipOpen, setSlipOpen] = useState(false)

  if (!order) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold">{t('orderDetail.notFound')}</p>
        <Button asChild className="mt-4 min-h-11" variant="outline">
          <Link to="/app/orders">{t('orderDetail.backOrders')}</Link>
        </Button>
      </div>
    )
  }

  const payments = bankPayments.filter((p) => p.orderId === order.id)
  const nextKey = nextLabelKeys[order.status]

  const advance = () => {
    const next = nextStatus[order.status]
    if (!next) {
      toast.message('No further status action')
      return
    }
    if (order.status === 'on_hold' && order.advancePaid <= 0) {
      toast.message('Attach a bank slip for the advance first', {
        description: 'Use Bank deposit + slip — common when customers pay delivery or deposit.',
      })
      setSlipOpen(true)
      return
    }
    const patch =
      next === 'confirmed'
        ? { confirmedAt: new Date().toISOString() }
        : next === 'packed'
          ? { packedAt: new Date().toISOString() }
          : next === 'dispatched'
            ? {
                dispatchedAt: new Date().toISOString(),
                waybill: order.waybill ?? `KOOM-${Math.floor(Math.random() * 900000 + 100000)}`,
                courier: order.courier ?? 'Koombiyo',
              }
            : next === 'delivered'
              ? { deliveredAt: new Date().toISOString() }
              : {}
    updateOrderStatus(order.id, next, patch)
    toast.success(`Order ${order.number} → ${next.replace('_', ' ')}`)
  }

  const hold = () => {
    updateOrderStatus(order.id, 'on_hold')
    toast.message('On hold — ask customer to bank the advance / delivery', {
      description: `${tenant.bankAccount.bankName} ${tenant.bankAccount.accountNumber}`,
    })
    setSlipOpen(true)
  }

  const timeline = [
    { label: t('status.new'), at: order.createdAt },
    { label: t('status.confirmed'), at: order.confirmedAt },
    { label: t('status.packed'), at: order.packedAt },
    { label: t('status.dispatched'), at: order.dispatchedAt },
    { label: t('status.delivered'), at: order.deliveredAt },
  ]

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 min-h-10">
        <Link to="/app/orders">
          <ArrowLeft className="h-4 w-4" /> {t('orders.title')}
        </Link>
      </Button>
      <PageHeader
        eyebrow={order.channel}
        title={order.number}
        description={`${order.customerName} · ${formatPhone(order.customerPhone)}`}
        tip={t('orderDetail.tip')}
        actions={
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <RiskBadge level={order.riskLevel} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">{t('orderDetail.lines')}</h2>
            <div className="mt-3 divide-y divide-line">
              {order.lines.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{l.productTitle}</p>
                    <p className="text-xs text-muted">
                      {l.variantName} · {l.sku} · ×{l.qty}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatLkr(l.unitPrice * l.qty)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2 border-t border-line pt-3 text-sm">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="min-w-0 text-muted">{t('orderDetail.subtotal')}</span>
                <span className="shrink-0 font-semibold tabular-nums">{formatLkr(order.subtotal)}</span>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="min-w-0 text-muted">{t('orderDetail.delivery')}</span>
                <span className="shrink-0 font-semibold tabular-nums">{formatLkr(order.deliveryFee)}</span>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="min-w-0 text-muted">{t('orderDetail.discount')}</span>
                <span className="shrink-0 font-semibold tabular-nums">-{formatLkr(order.discount)}</span>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="min-w-0 text-muted">{t('orderDetail.bankPaid')}</span>
                <span className="shrink-0 font-semibold tabular-nums">{formatLkr(order.advancePaid)}</span>
              </div>
              <div className="mt-1 flex flex-col gap-0.5 rounded-lg bg-cash/15 px-3 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="min-w-0 text-base font-bold">{t('orderDetail.codDue')}</span>
                <span className="shrink-0 text-lg font-extrabold tabular-nums">
                  {formatLkr(order.codAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-lg font-bold">{t('orderDetail.bankPayments')}</h2>
              <Button
                size="sm"
                variant="cash"
                className="w-full sm:w-auto"
                onClick={() => setSlipOpen(true)}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0" /> {t('orderDetail.depositSlip')}
              </Button>
            </div>
            {payments.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{t('orderDetail.noSlips')}</p>
            ) : (
              <div className="mt-3 space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-2 rounded-lg border border-line px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {formatLkr(p.amount)} · {t(`pay.${p.purpose}`)}
                      </p>
                      <p className="text-xs text-muted">
                        {p.depositedAt}
                        {p.slipName ? ` · ${p.slipName}` : ''}
                      </p>
                    </div>
                    <Badge
                      variant={
                        p.status === 'verified' ? 'ok' : p.status === 'pending' ? 'cash' : 'risk'
                      }
                    >
                      {t(`pay.${p.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 break-words rounded-lg bg-paper p-3 text-xs text-muted">
              {t('orderDetail.shareAccount')}: {tenant.bankAccount.bankName} ·{' '}
              {tenant.bankAccount.accountNumber} · {tenant.bankAccount.branch}
            </div>
          </div>

          {order.notes ? (
            <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
              <p className="text-xs font-semibold tracking-wide text-muted">{t('orderDetail.notes')}</p>
              <div className="mt-2 rounded-lg border border-dashed border-line bg-paper p-3 text-sm">
                <p className="break-words">{order.notes}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">{t('orderDetail.actions')}</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="cash"
                className="min-h-12 w-full px-4 py-3 text-base"
                onClick={() => setSlipOpen(true)}
              >
                {t('orderDetail.bankDeposit')}
              </Button>
              {nextKey ? (
                <Button
                  variant="lagoon"
                  className="min-h-12 w-full px-4 py-3 text-base"
                  onClick={advance}
                >
                  {t(nextKey)}
                </Button>
              ) : null}
              {order.status === 'new' && order.riskLevel !== 'low' ? (
                <Button variant="outline" className="min-h-12 w-full px-4 py-3" onClick={hold}>
                  {t('orderDetail.holdAdvance')}
                </Button>
              ) : null}
              {order.waybill ? (
                <Button asChild variant="soft" className="min-h-11 w-full">
                  <Link to={`/track/${order.waybill}`}>{t('orderDetail.tracking')}</Link>
                </Button>
              ) : null}
              <Button asChild variant="ghost" className="min-h-11 w-full">
                <Link to={`/app/customers/${order.customerId}`}>{t('orderDetail.openCustomer')}</Link>
              </Button>
              <Button asChild variant="ghost" className="min-h-11 w-full">
                <Link to="/app/payments">{t('orderDetail.allSlips')}</Link>
              </Button>
            </div>
            {(order.waybill || order.courier) && (
              <div className="mt-4 rounded-lg bg-paper p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-muted">{t('orderDetail.shipment')}</p>
                <p className="mt-1 font-semibold">
                  {order.courier} · {order.waybill}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">{t('orderDetail.timeline')}</h2>
            <ol className="mt-3 space-y-3">
              {timeline.map((item) => (
                <li key={item.label} className="flex gap-3 text-sm">
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full ${item.at ? 'bg-lagoon' : 'bg-stone'}`}
                  />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted">
                      {item.at ? new Date(item.at).toLocaleString('en-LK') : '—'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <h2 className="font-display text-lg font-bold">{t('orderDetail.deliverTo')}</h2>
            <p className="mt-2 text-sm">
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.district}
              {order.address.postalCode ? ` ${order.address.postalCode}` : ''}
            </p>
          </div>
        </div>
      </div>

      <BankSlipDialog order={order} open={slipOpen} onOpenChange={setSlipOpen} />
    </div>
  )
}
