import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { StatTile } from '@/components/common/StatTile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { Banknote } from 'lucide-react'
import { formatLkr } from '@/lib/utils'

export function CodPage() {
  const t = useT()
  const remittances = useAppStore((s) => s.remittances)
  const orders = useAppStore((s) => s.orders)
  const matchRemittance = useAppStore((s) => s.matchRemittance)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState('')

  const unmatched = remittances.filter((r) => !r.matched)
  const unmatchedTotal = unmatched.reduce((s, r) => s + r.amount, 0)
  const matchedTotal = remittances.filter((r) => r.matched).reduce((s, r) => s + r.amount, 0)

  const deliverableOrders = orders.filter((o) =>
    ['delivered', 'paid', 'dispatched'].includes(o.status),
  )

  return (
    <div>
      <PageHeader
        eyebrow={t('cod.eyebrow')}
        title={t('cod.title')}
        description={t('cod.description')}
        tip={t('cod.tip')}
        actions={
          <Button
            variant="cash"
            className="min-h-11"
            onClick={() =>
              toast.success(t('cod.importCsv'), {
                description: t('cod.tip'),
              })
            }
          >
            {t('cod.importCsv')}
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatTile
          label={t('cod.unmatchedLines')}
          value={String(unmatched.length)}
          icon={Banknote}
          tone="cash"
        />
        <StatTile
          label={t('cod.unmatchedValue')}
          value={formatLkr(unmatchedTotal)}
          icon={Banknote}
          tone="risk"
        />
        <StatTile
          label={t('cod.matchedWeek')}
          value={formatLkr(matchedTotal)}
          icon={Banknote}
          tone="ok"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
        {remittances.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-4 py-3 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold">{r.waybill}</p>
              <p className="text-xs text-muted">
                {r.courier} · {r.statementRef} · {r.remittedAt}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{formatLkr(r.amount)}</p>
                <p className="text-xs text-muted">Fee {formatLkr(r.fee)}</p>
              </div>
              {r.matched ? (
                <Badge variant="ok">{t('cod.matched')}</Badge>
              ) : (
                <Button
                  size="sm"
                  variant="lagoon"
                  className="min-h-11"
                  onClick={() => {
                    setActiveId(r.id)
                    setOrderId(deliverableOrders[0]?.id ?? '')
                  }}
                >
                  {t('cod.match')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!activeId} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cod.matchTitle')}</DialogTitle>
          </DialogHeader>
          <Select value={orderId} onValueChange={setOrderId}>
            <SelectTrigger className="min-h-11">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {deliverableOrders.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.number} · {o.waybill ?? '—'} · {formatLkr(o.codAmount)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="mt-3 min-h-11"
            variant="lagoon"
            onClick={() => {
              if (!activeId || !orderId) return
              matchRemittance(activeId, orderId)
              toast.success('Remittance matched')
              setActiveId(null)
            }}
          >
            {t('cod.confirmMatch')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
