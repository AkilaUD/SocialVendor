import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { TicketStatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { Ticket } from '@/types'
import { cn } from '@/lib/utils'

export function TicketsPage() {
  const t = useT()
  const tickets = useAppStore((s) => s.tickets)
  const updateTicketStatus = useAppStore((s) => s.updateTicketStatus)
  const [active, setActive] = useState<Ticket | null>(null)

  return (
    <div>
      <PageHeader
        eyebrow={t('tickets.eyebrow')}
        title={t('tickets.title')}
        description={t('tickets.description')}
        tip={t('tickets.tip')}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t)}
            className="rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-desk)] hover:border-lagoon/40"
          >
            <div className="flex items-start justify-between gap-2">
              <TicketStatusBadge status={t.status} />
              <Badge
                variant={t.priority === 'high' ? 'risk' : t.priority === 'medium' ? 'cash' : 'muted'}
              >
                {t.priority}
              </Badge>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold leading-snug">{t.subject}</h3>
            <p className="mt-1 text-sm text-muted">
              {t.customerName}
              {t.orderNumber ? ` · ${t.orderNumber}` : ''}
            </p>
            <p className="mt-2 text-xs text-muted">
              {t.category} · SLA {t.slaHours}h · {t.owner}
            </p>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.subject}</DialogTitle>
          </DialogHeader>
          {active ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                {active.customerName} · {active.category}
                {active.rootCause ? ` · Root cause: ${active.rootCause}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['open', 'in_progress', 'waiting', 'resolved', 'closed'] as Ticket['status'][]).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    className={cn(active.status === s && 'border-lagoon bg-mint/20')}
                    onClick={() => {
                      updateTicketStatus(active.id, s)
                      setActive({ ...active, status: s })
                      toast.success(`Ticket → ${s.replace('_', ' ')}`)
                    }}
                  >
                    {s.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
