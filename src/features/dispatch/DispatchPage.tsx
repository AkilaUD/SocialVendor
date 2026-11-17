import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function DispatchPage() {
  const t = useT()
  const orders = useAppStore((s) => s.orders)
  const shipments = useAppStore((s) => s.shipments)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)

  const packQueue = orders.filter((o) => ['confirmed', 'packed'].includes(o.status))

  const createWaybill = (orderId: string, number: string) => {
    const waybill = `KOOM-${Math.floor(Math.random() * 900000 + 100000)}`
    updateOrderStatus(orderId, 'dispatched', {
      packedAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString(),
      waybill,
      courier: 'Koombiyo',
    })
    toast.success(`${t('dispatch.createWaybill')}: ${waybill} · ${number}`)
  }

  return (
    <div>
      <PageHeader
        eyebrow={t('dispatch.eyebrow')}
        title={t('dispatch.title')}
        description={t('dispatch.description')}
        tip={t('dispatch.tip')}
      />

      <div className="mb-4 rounded-xl border border-cash/40 bg-cash/20 px-4 py-3 text-sm">
        {t('dispatch.cutoff')}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <h2 className="font-display text-lg font-bold">{t('dispatch.packList')}</h2>
          <div className="mt-3 space-y-2">
            {packQueue.map((o) => (
              <div key={o.id} className="rounded-lg border border-line px-3 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {o.number} · {o.customerName}
                    </p>
                    <p className="text-xs text-muted">
                      {o.lines.map((l) => `${l.productTitle} ×${l.qty}`).join(', ')}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {o.address.city}, {o.address.district} · {t('nav.cod')} {formatLkr(o.codAmount)}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.status === 'confirmed' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => {
                        updateOrderStatus(o.id, 'packed', { packedAt: new Date().toISOString() })
                        toast.success(`${o.number} packed`)
                      }}
                    >
                      {t('dispatch.markPacked')}
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="lagoon"
                    className="min-h-11"
                    onClick={() => createWaybill(o.id, o.number)}
                  >
                    {t('dispatch.createWaybill')}
                  </Button>
                </div>
              </div>
            ))}
            {packQueue.length === 0 ? (
              <p className="text-sm text-muted">{t('dispatch.empty')}</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <h2 className="font-display text-lg font-bold">{t('dispatch.shipments')}</h2>
          <div className="mt-3 space-y-2">
            {shipments.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line px-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.waybill}</p>
                  <p className="text-xs text-muted">
                    {s.orderNumber} · {s.courier} · {s.district}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold capitalize text-muted">
                    {s.status.replaceAll('_', ' ')}
                  </p>
                  <p className="mt-1 text-xs font-semibold">{formatLkr(s.codAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
