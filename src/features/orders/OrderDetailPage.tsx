import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Check, Pencil, Wallet } from 'lucide-react'
import { BigButton } from '@/components/kade/BigButton'
import { Road, statusToStop } from '@/components/kade/Road'
import { Stamp } from '@/components/kade/Stamp'
import { BankSlipDialog } from '@/components/payments/BankSlipDialog'
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

export function OrderDetailPage() {
  const t = useT()
  const { id } = useParams()
  const orders = useAppStore((s) => s.orders)
  const tenant = useAppStore((s) => s.tenant)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)
  const order = orders.find((o) => o.id === id)
  const [slipOpen, setSlipOpen] = useState(false)
  const [stampLabel, setStampLabel] = useState<string | null>(null)
  const [stampKind, setStampKind] = useState('confirmed')

  if (!order) {
    return (
      <div className="rounded-xl border-2 border-ink bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold">{t('orderDetail.notFound')}</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/app/orders">{t('orderDetail.backOrders')}</Link>
        </Button>
      </div>
    )
  }

  const primaryLabel =
    order.status === 'new' || order.status === 'on_hold'
      ? t('kade.correct')
      : order.status === 'confirmed'
        ? t('kade.packIt')
        : order.status === 'packed'
          ? t('kade.sendIt')
          : order.status === 'dispatched' || order.status === 'delivered'
            ? t('kade.moneyCame')
            : null

  const advance = () => {
    const next = nextStatus[order.status]
    if (!next) {
      toast.message(t('common.done'))
      return
    }
    if (order.status === 'on_hold' && order.advancePaid <= 0) {
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
    const label =
      next === 'packed'
        ? t('kade.stampPacked')
        : next === 'dispatched'
          ? t('kade.stampSent')
          : next === 'delivered'
            ? t('kade.stampDelivered')
            : next === 'paid'
              ? t('kade.stampPaid')
              : t('kade.stampReady')
    setStampKind(next)
    setStampLabel(label)
    toast.success(label)
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className=" -ml-2">
        <Link to="/app/orders">
          <ArrowLeft className="h-5 w-5" /> {t('nav.parcels')}
        </Link>
      </Button>

      <div className="parcel-tag relative p-5">
        <div className="absolute right-4 top-3 h-3 w-3 rounded-full border-2 border-ink bg-paper" />
        <p className="font-money text-sm text-muted">{order.number}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">{order.customerName}</h1>
        <p className="mt-1 text-base">{formatPhone(order.customerPhone)}</p>
        <p className="mt-1 text-muted">
          {order.address.line1}, {order.address.city}
        </p>
        <p className="mt-4 font-money text-4xl text-ink">
          {formatLkr(order.codAmount || order.subtotal + order.deliveryFee - order.discount)}
        </p>
        <div className="absolute bottom-4 right-4">
          <Stamp label={stampLabel ?? ''} kind={stampKind} show={!!stampLabel} />
        </div>
      </div>

      <Road current={statusToStop(order.status)} t={t} />

      <div className="rounded-xl border-2 border-ink bg-surface p-4">
        {order.lines.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
            <div className="min-w-0">
              <p className="font-extrabold leading-snug">{l.productTitle}</p>
              <p className="text-sm text-muted">
                {l.variantName} · ×{l.qty}
              </p>
            </div>
            <p className="shrink-0 font-money text-lg">{formatLkr(l.unitPrice * l.qty)}</p>
          </div>
        ))}
      </div>

      {primaryLabel ? (
        <BigButton
          tone="primary"
          icon={
            order.status === 'delivered' ? (
              <Wallet className="h-7 w-7" />
            ) : (
              <Check className="h-7 w-7" />
            )
          }
          speakText={primaryLabel}
          onClick={advance}
        >
          {primaryLabel}
        </BigButton>
      ) : null}

      <BigButton
        tone="ghost"
        icon={<Pencil className="h-6 w-6" />}
        speakText={t('orderDetail.bankDeposit')}
        onClick={() => setSlipOpen(true)}
      >
        {t('orderDetail.bankDeposit')}
      </BigButton>

      <div className="rounded-xl border-2 border-ink bg-paper p-4 text-sm">
        <p className="font-extrabold">{t('orderDetail.shareAccount')}</p>
        <p className="mt-1 break-words">
          {tenant.bankAccount.bankName} · {tenant.bankAccount.accountNumber} ·{' '}
          {tenant.bankAccount.branch}
        </p>
      </div>

      <BankSlipDialog order={order} open={slipOpen} onOpenChange={setSlipOpen} />
    </div>
  )
}
