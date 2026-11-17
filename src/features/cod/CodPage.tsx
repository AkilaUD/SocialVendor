import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Bike } from 'lucide-react'
import { BigButton } from '@/components/kade/BigButton'
import { CoinPile } from '@/components/kade/CoinPile'
import { Purse } from '@/components/kade/Purse'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function CodPage() {
  const t = useT()
  const remittances = useAppStore((s) => s.remittances)
  const orders = useAppStore((s) => s.orders)
  const expenses = useAppStore((s) => s.expenses)
  const returns = useAppStore((s) => s.returns)
  const matchRemittance = useAppStore((s) => s.matchRemittance)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState('')

  const unmatched = remittances.filter((r) => !r.matched)
  const unmatchedTotal = unmatched.reduce((s, r) => s + r.amount, 0)
  const matchedTotal = remittances.filter((r) => r.matched).reduce((s, r) => s + r.amount, 0)
  const wentOut = expenses.reduce((s, e) => s + e.amount, 0)
  const kept = Math.max(0, matchedTotal - wentOut)
  const cameBack = returns.length

  const deliverableOrders = orders.filter((o) =>
    ['delivered', 'paid', 'dispatched'].includes(o.status),
  )

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{t('nav.money')}</h1>

      <Purse amount={kept} label={t('kade.youKept')} />

      <div className="grid gap-3 sm:grid-cols-2">
        <CoinPile amount={matchedTotal} label={t('kade.cameIn')} tone="in" />
        <CoinPile amount={wentOut} label={t('kade.wentOut')} tone="out" />
      </div>

      <BigButton tone="board" icon={<Bike className="h-7 w-7" />} speakText={t('kade.onTheRoad')}>
        {`${t('kade.onTheRoad')} · ${formatLkr(unmatchedTotal)}`}
      </BigButton>

      <Link
        to="/app/returns"
        className="flex min-h-16 items-center justify-between rounded-xl border-2 border-risk bg-risk/10 px-4 py-3 font-extrabold text-risk"
      >
        <span>{t('kade.cameBack')}</span>
        <span className="font-money text-2xl">{cameBack}</span>
      </Link>

      <div className="space-y-3">
        {unmatched.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-ink bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-extrabold">{r.waybill}</p>
              <p className="text-sm text-muted">
                {r.courier} · {r.remittedAt}
              </p>
              <p className="mt-1 font-money text-2xl">{formatLkr(r.amount)}</p>
            </div>
            <BigButton
              tone="done"
              className="sm:w-auto"
              icon={<Check className="h-6 w-6" />}
              speakText={t('kade.moneyCame')}
              onClick={() => {
                setActiveId(r.id)
                setOrderId(deliverableOrders[0]?.id ?? '')
              }}
            >
              {t('kade.moneyCame')}
            </BigButton>
          </div>
        ))}
        {unmatched.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-ink p-8 text-center font-extrabold text-muted">
            {t('common.done')}
          </div>
        ) : null}
      </div>

      <Dialog open={!!activeId} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('kade.moneyCame')}</DialogTitle>
          </DialogHeader>
          <Select value={orderId} onValueChange={setOrderId}>
            <SelectTrigger className="min-h-14">
              <SelectValue placeholder={t('nav.parcels')} />
            </SelectTrigger>
            <SelectContent>
              {deliverableOrders.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.number} · {o.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <BigButton
            tone="done"
            speakText={t('kade.correct')}
            onClick={() => {
              if (!activeId || !orderId) return
              matchRemittance(activeId, orderId)
              toast.success(t('kade.moneyCame'))
              setActiveId(null)
            }}
          >
            {t('kade.correct')}
          </BigButton>
        </DialogContent>
      </Dialog>
    </div>
  )
}
