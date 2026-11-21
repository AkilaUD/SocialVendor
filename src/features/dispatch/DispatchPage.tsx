import { toast } from 'sonner'
import { BigButton } from '@/components/kade/BigButton'
import { OrderTag } from '@/components/kade/OrderTag'
import { Pictogram } from '@/components/kade/Pictogram'
import { Road } from '@/components/kade/Road'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusBadge } from '@/components/common/StatusBadge'
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

      <div className="mb-4 rounded-xl border-2 border-ink bg-cash/20 px-4 py-3 text-base font-extrabold">
        {t('dispatch.cutoff')}
      </div>

      <div className="mb-4">
        <Road current="bag" t={t} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-ink bg-surface p-5">
          <h2 className="text-lg font-extrabold">{t('dispatch.packList')}</h2>
          <div className="mt-3 space-y-3">
            {packQueue.map((o) => (
              <div key={o.id} className="space-y-2">
                <OrderTag
                  to={`/app/orders/${o.id}`}
                  number={o.number}
                  who={o.customerName}
                  where={o.address.city}
                  amount={o.codAmount}
                  stamp={o.status === 'packed' ? t('stamp.packed') : undefined}
                  stampKind="packed"
                />
                <div className="flex flex-col gap-2">
                  {o.status === 'confirmed' ? (
                    <BigButton
                      tone="ghost"
                      icon={<Pictogram id="parcel" />}
                      speakText={t('dispatch.markPacked')}
                      onClick={() => {
                        updateOrderStatus(o.id, 'packed', { packedAt: new Date().toISOString() })
                        toast.success(`${o.number} packed`)
                      }}
                    >
                      {t('dispatch.markPacked')}
                    </BigButton>
                  ) : null}
                  <BigButton
                    tone="primary"
                    icon={<Pictogram id="bike" />}
                    speakText={t('dispatch.createWaybill')}
                    onClick={() => createWaybill(o.id, o.number)}
                  >
                    {t('dispatch.createWaybill')}
                  </BigButton>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
            ))}
            {packQueue.length === 0 ? (
              <p className="text-base text-muted">{t('dispatch.empty')}</p>
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
