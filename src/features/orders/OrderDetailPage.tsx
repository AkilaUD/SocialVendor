import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { BigButton } from '@/components/kade/BigButton'
import { Pictogram } from '@/components/kade/Pictogram'
import { Road, statusToStop } from '@/components/kade/Road'
import { Stamp } from '@/components/kade/Stamp'
import { OrderStatusBadge, RiskBadge } from '@/components/common/StatusBadge'
import { BankSlipDialog } from '@/components/payments/BankSlipDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
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

function stampKey(status: OrderStatus): string | null {
  if (status === 'confirmed') return 'confirmed'
  if (status === 'packed') return 'packed'
  if (status === 'dispatched') return 'sent'
  if (status === 'delivered') return 'delivered'
  if (status === 'paid') return 'paid'
  if (status === 'rto' || status === 'returned') return 'returned'
  return null
}

export function OrderDetailPage() {
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const { id } = useParams()
  const orders = useAppStore((s) => s.orders)
  const bankPayments = useAppStore((s) => s.bankPayments)
  const tenant = useAppStore((s) => s.tenant)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)
  const order = orders.find((o) => o.id === id)
  const [slipOpen, setSlipOpen] = useState(false)
  const [stampShow, setStampShow] = useState(false)
  const [showMoreParcel, setShowMoreParcel] = useState(false)

  useEffect(() => {
    if (!order) return
    setStampShow(false)
    const id = window.setTimeout(() => setStampShow(true), 50)
    return () => window.clearTimeout(id)
  }, [order?.status, order?.id])

  if (!order) {
    return (
      <div className="rounded-xl border-2 border-ink bg-surface p-8 text-center">
        <p className="text-xl font-extrabold">{t('orderDetail.notFound')}</p>
        <BigButton to="/app/orders" className="mt-4">
          {t('orderDetail.backOrders')}
        </BigButton>
      </div>
    )
  }

  const payments = bankPayments.filter((p) => p.orderId === order.id)
  const nextKey = nextLabelKeys[order.status]
  const sk = stampKey(order.status)

  const advance = () => {
    const next = nextStatus[order.status]
    if (!next) {
      toast.message('No further status action')
      return
    }
    if (order.status === 'on_hold' && order.advancePaid <= 0) {
      toast.message('Attach a bank slip for the advance first')
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

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="min-h-11 -ml-2">
        <Link to="/app/orders">
          <ArrowLeft className="h-4 w-4" /> {t('orders.title')}
        </Link>
      </Button>

      <div className="parcel-tag relative p-5">
        <p className="font-money text-sm text-muted">{order.number}</p>
        <p className="mt-1 text-2xl font-extrabold">{order.customerName}</p>
        <p className="text-base text-muted">{formatPhone(order.customerPhone)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <RiskBadge level={order.riskLevel} />
        </div>
        {sk ? (
          <div className="absolute right-4 top-6">
            <Stamp label={t(`stamp.${sk}`)} kind={sk} show={stampShow} />
          </div>
        ) : null}
      </div>

      <Road current={statusToStop(order.status)} t={t} />

      <div className="rounded-xl border-2 border-ink bg-cash/20 px-4 py-3">
        <p className="text-base font-extrabold">{t('orderDetail.codDue')}</p>
        <p className="font-money text-4xl">{formatLkr(order.codAmount)}</p>
      </div>

      <div className="space-y-2">
        {nextKey ? (
          <BigButton
            tone="primary"
            icon={<Pictogram id="stamp" />}
            speakText={t(nextKey)}
            onClick={advance}
          >
            {t(nextKey)}
          </BigButton>
        ) : null}
        <BigButton
          tone="ghost"
          icon={<Pictogram id="camera" />}
          speakText={t('orderDetail.bankDeposit')}
          onClick={() => setSlipOpen(true)}
        >
          {t('orderDetail.bankDeposit')}
        </BigButton>
        {order.status === 'new' && order.riskLevel !== 'low' ? (
          <BigButton tone="danger" icon={<Pictogram id="hand" />} onClick={hold} speakText={t('orderDetail.holdAdvance')}>
            {t('orderDetail.holdAdvance')}
          </BigButton>
        ) : null}
      </div>

      {simpleMode && !showMoreParcel ? (
        <button
          type="button"
          onClick={() => setShowMoreParcel(true)}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-3 font-extrabold active:translate-y-px"
        >
          <Pictogram id="parcel" className="h-10 w-10" />
          {t('simple.moreParcel')}
        </button>
      ) : (
        <>
          <div className="rounded-xl border-2 border-ink bg-surface p-4">
            <h2 className="text-lg font-extrabold">{t('orderDetail.lines')}</h2>
            <div className="mt-2 divide-y divide-line">
              {order.lines.map((l) => (
                <div key={l.id} className="flex justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-extrabold">{l.productTitle}</p>
                    <p className="text-sm text-muted">
                      {l.variantName} · ×{l.qty}
                    </p>
                  </div>
                  <p className="font-money shrink-0">{formatLkr(l.unitPrice * l.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border-2 border-ink bg-surface p-4">
            <h2 className="text-lg font-extrabold">{t('orderDetail.bankPayments')}</h2>
            {payments.length === 0 ? (
              <p className="mt-2 text-base text-muted">{t('orderDetail.noSlips')}</p>
            ) : (
              <div className="mt-2 space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink/20 px-3 py-2"
                  >
                    <p className="font-extrabold">
                      {formatLkr(p.amount)} · {t(`pay.${p.purpose}`)}
                    </p>
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
            <p className="mt-3 break-words text-sm text-muted">
              {t('orderDetail.shareAccount')}: {tenant.bankAccount.bankName} ·{' '}
              {tenant.bankAccount.accountNumber}
            </p>
          </div>

          {order.notes ? (
            <div className="rounded-xl border-2 border-ink bg-surface p-4">
              <p className="font-extrabold text-muted">{t('orderDetail.notes')}</p>
              <p className="mt-2 text-base">{order.notes}</p>
            </div>
          ) : null}

          <div className="rounded-xl border-2 border-ink bg-surface p-4">
            <h2 className="text-lg font-extrabold">{t('orderDetail.deliverTo')}</h2>
            <p className="mt-2 text-base">
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.district}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {order.waybill ? (
              <BigButton to={`/track/${order.waybill}`} tone="board" icon={<Pictogram id="bike" />}>
                {t('orderDetail.tracking')}
              </BigButton>
            ) : null}
            <BigButton to={`/app/customers/${order.customerId}`} tone="ghost">
              {t('orderDetail.openCustomer')}
            </BigButton>
            <BigButton to="/app/payments" tone="ghost">
              {t('orderDetail.allSlips')}
            </BigButton>
          </div>
        </>
      )}

      <BankSlipDialog order={order} open={slipOpen} onOpenChange={setSlipOpen} />
    </div>
  )
}
