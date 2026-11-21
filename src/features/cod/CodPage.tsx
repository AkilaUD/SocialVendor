import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { BigButton } from '@/components/kade/BigButton'
import { CoinPile } from '@/components/kade/CoinPile'
import { Pictogram } from '@/components/kade/Pictogram'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function CodPage() {
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const remittances = useAppStore((s) => s.remittances)
  const orders = useAppStore((s) => s.orders)
  const expenses = useAppStore((s) => s.expenses)
  const returns = useAppStore((s) => s.returns)
  const matchRemittance = useAppStore((s) => s.matchRemittance)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState('')
  const [showMoreMoney, setShowMoreMoney] = useState(false)

  const unmatched = remittances.filter((r) => !r.matched)
  const unmatchedTotal = unmatched.reduce((s, r) => s + r.amount, 0)
  const matchedTotal = remittances.filter((r) => r.matched).reduce((s, r) => s + r.amount, 0)
  const wentOut = expenses.reduce((s, e) => s + e.amount, 0)

  const deliverableOrders = orders.filter((o) =>
    ['delivered', 'paid', 'dispatched'].includes(o.status),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">{t('nav.money')}</h1>
      {!simpleMode ? (
        <p className="text-base text-muted">{t('cod.description')}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <CoinPile amount={matchedTotal} label={t('moneyUi.cameIn')} tone="in" />
        <CoinPile amount={wentOut} label={t('moneyUi.wentOut')} tone="out" />
        <CoinPile amount={unmatchedTotal} label={t('moneyUi.onRoad')} tone="kept" />
      </div>

      <Link
        to="/app/returns"
        className="flex items-center gap-3 rounded-xl border-2 border-ink bg-surface p-4"
      >
        <Pictogram id="hand" className="h-12 w-12" />
        <div>
          <p className="font-extrabold">{t('moneyUi.cameBack')}</p>
          <p className="font-money text-2xl">{returns.length}</p>
        </div>
      </Link>

      <div className="rounded-xl border-2 border-ink bg-surface">
        {remittances.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-4 py-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold">{r.waybill}</p>
              <p className="text-sm text-muted">
                {r.courier} · {r.remittedAt}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <p className="font-money text-lg">{formatLkr(r.amount)}</p>
              {r.matched ? (
                <Badge variant="ok">{t('cod.matched')}</Badge>
              ) : (
                <Button
                  size="sm"
                  variant="cash"
                  className="min-h-12 border-2 border-ink"
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

      {simpleMode && !showMoreMoney ? (
        <button
          type="button"
          onClick={() => setShowMoreMoney(true)}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-3 font-extrabold active:translate-y-px"
        >
          <Pictogram id="coin" className="h-10 w-10" />
          {t('simple.moreMoney')}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <BigButton
            icon={<Pictogram id="parcel" />}
            speakText={t('cod.importCsv')}
            onClick={() => toast.success(t('cod.importCsv'), { description: t('cod.tip') })}
          >
            {t('cod.importCsv')}
          </BigButton>
          <BigButton to="/app/payments" tone="ghost" icon={<Pictogram id="camera" />}>
            {t('nav.payments')}
          </BigButton>
          <BigButton to="/app/expenses" tone="ghost" icon={<Pictogram id="coin" />}>
            {t('nav.expenses')}
          </BigButton>
        </div>
      )}

      <Dialog open={!!activeId} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cod.matchTitle')}</DialogTitle>
          </DialogHeader>
          <Select value={orderId} onValueChange={setOrderId}>
            <SelectTrigger className="min-h-12 border-2 border-ink">
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
          <BigButton
            className="mt-3"
            tone="done"
            onClick={() => {
              if (!activeId || !orderId) return
              matchRemittance(activeId, orderId)
              toast.success('Remittance matched')
              setActiveId(null)
            }}
          >
            {t('cod.confirmMatch')}
          </BigButton>
        </DialogContent>
      </Dialog>
    </div>
  )
}
