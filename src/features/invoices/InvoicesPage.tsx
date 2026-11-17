import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { Invoice } from '@/types'
import { cn, formatLkr } from '@/lib/utils'

export function InvoicesPage() {
  const t = useT()
  const invoices = useAppStore((s) => s.invoices)
  const tenant = useAppStore((s) => s.tenant)
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all')
  const [active, setActive] = useState<Invoice | null>(null)

  const rows = invoices.filter((i) => filter === 'all' || i.status === filter)

  return (
    <div>
      <PageHeader
        eyebrow={t('invoices.eyebrow')}
        title={t('invoices.title')}
        description={t('invoices.description')}
      />

      <div className="mb-4 flex gap-1">
        {(['all', 'sent', 'paid', 'draft', 'void'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold capitalize',
              filter === f ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-muted',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
        {rows.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-4 py-3 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold">{inv.number}</p>
              <p className="text-xs text-muted">
                {inv.customerName} · {inv.orderNumber} · {inv.issuedAt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{formatLkr(inv.total)}</p>
              <Badge variant={inv.status === 'paid' ? 'ok' : 'lagoon'}>{inv.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setActive(inv)}>
                View
              </Button>
              <Button
                size="sm"
                variant="soft"
                onClick={() => toast.success(`WhatsApp invoice link queued for ${inv.customerName}`)}
              >
                Send
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.number}</DialogTitle>
          </DialogHeader>
          {active ? (
            <div className="space-y-2 text-sm">
              <p className="font-display text-xl font-bold">{tenant.businessName}</p>
              <p className="text-muted">Bill to {active.customerName}</p>
              <p>Order {active.orderNumber}</p>
              <p className="font-semibold text-lg">{formatLkr(active.total)}</p>
              <p className="text-xs text-muted">{tenant.returnPolicy}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
