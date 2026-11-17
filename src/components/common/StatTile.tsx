import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: 'default' | 'cash' | 'risk' | 'ok'
}) {
  const tones = {
    default: 'bg-surface',
    cash: 'bg-gradient-to-br from-cash/30 to-white',
    risk: 'bg-gradient-to-br from-risk/10 to-white',
    ok: 'bg-gradient-to-br from-ok/10 to-white',
  }
  return (
    <div className={cn('rounded-xl border border-line/80 p-4 shadow-[var(--shadow-desk)]', tones[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-on-ink">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
