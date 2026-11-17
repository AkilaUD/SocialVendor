import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Building2, Check, X } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { BankPayment, BankPaymentStatus } from '@/types'
import { cn, formatLkr } from '@/lib/utils'

export function PaymentsPage() {
  const t = useT()
  const bankPayments = useAppStore((s) => s.bankPayments)
  const tenant = useAppStore((s) => s.tenant)
  const setBankPaymentStatus = useAppStore((s) => s.setBankPaymentStatus)
  const [filter, setFilter] = useState<'all' | BankPaymentStatus>('all')
  const [preview, setPreview] = useState<BankPayment | null>(null)

  const rows = useMemo(
    () => bankPayments.filter((p) => filter === 'all' || p.status === filter),
    [bankPayments, filter],
  )

  const pendingCount = bankPayments.filter((p) => p.status === 'pending').length

  return (
    <div>
      <PageHeader
        eyebrow={t('payments.eyebrow')}
        title={t('payments.title')}
        description={t('payments.description')}
        tip={t('payments.tip')}
      />

      <div className="mb-4 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-desk)]">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-on-ink">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wide text-muted">
              {t('payments.yourAccount')}
            </p>
            <p className="break-words font-semibold">
              {tenant.bankAccount.bankName} · {tenant.bankAccount.accountName}
            </p>
            <p className="text-sm text-muted">
              A/C {tenant.bankAccount.accountNumber} · {tenant.bankAccount.branch}
            </p>
            <Button asChild size="sm" variant="soft" className="mt-2 min-h-10">
              <Link to="/app/settings">{t('payments.editSettings')}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex max-w-full gap-1 overflow-x-auto pb-1">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize',
              filter === f ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-muted',
            )}
          >
            {f === 'all' ? t('common.all') : t(`pay.${f}`)}
            {f === 'pending' && pendingCount ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-paper px-6 py-12 text-center text-sm text-muted">
            {t('payments.empty')}
          </div>
        ) : (
          rows.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-desk)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold">{formatLkr(p.amount)}</p>
                  <p className="text-sm text-muted">
                    {p.orderNumber} · {p.customerName} · {t(`pay.${p.purpose}`)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Deposited {p.depositedAt}
                    {p.reference ? ` · Ref ${p.reference}` : ''}
                    {p.slipName ? ` · ${p.slipName}` : ''}
                  </p>
                  {p.note ? <p className="mt-2 text-sm">{p.note}</p> : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={
                      p.status === 'verified' ? 'ok' : p.status === 'pending' ? 'cash' : 'risk'
                    }
                  >
                    {t(`pay.${p.status}`)}
                  </Badge>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" className="min-h-10" onClick={() => setPreview(p)}>
                      {t('payments.viewSlip')}
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="min-h-10">
                      <Link to={`/app/orders/${p.orderId}`}>{t('payments.order')}</Link>
                    </Button>
                    {p.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          variant="lagoon"
                          className="min-h-10"
                          onClick={() => {
                            setBankPaymentStatus(p.id, 'verified')
                            toast.success(t('payments.verifiedToast'))
                          }}
                        >
                          <Check className="h-3.5 w-3.5" /> {t('payments.verify')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="min-h-10"
                          onClick={() => {
                            setBankPaymentStatus(p.id, 'rejected')
                            toast.message(t('payments.rejectedToast'))
                          }}
                        >
                          <X className="h-3.5 w-3.5" /> {t('payments.reject')}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {preview?.orderNumber} · {preview ? formatLkr(preview.amount) : ''}
            </DialogTitle>
          </DialogHeader>
          {preview?.slipDataUrl?.startsWith('data:image') ? (
            <img
              src={preview.slipDataUrl}
              alt="Bank slip"
              className="max-h-80 w-full rounded-lg border border-line object-contain"
            />
          ) : (
            <div className="rounded-xl bg-paper p-6 text-center text-sm text-muted">
              {preview?.slipName
                ? `Slip on file: ${preview.slipName} (demo preview not embedded)`
                : 'No slip image attached'}
            </div>
          )}
          {preview?.reference ? (
            <p className="text-sm text-muted">Reference: {preview.reference}</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
