import { cn, formatLkr } from '@/lib/utils'

export function CoinPile({
  amount,
  label,
  tone = 'in',
  className,
}: {
  amount: number
  label: string
  tone?: 'in' | 'out' | 'kept'
  className?: string
}) {
  const bars = Math.min(6, Math.max(1, Math.round(Math.abs(amount) / 3000) || 1))
  const color =
    tone === 'in' ? 'bg-ok' : tone === 'out' ? 'bg-risk' : 'bg-cash'

  return (
    <div
      className={cn(
        'rounded-xl border-2 border-ink bg-surface p-4',
        className,
      )}
    >
      <p className="text-base font-extrabold text-muted">{label}</p>
      <p className="mt-1 font-money text-3xl text-ink sm:text-4xl">{formatLkr(amount)}</p>
      <div className="mt-3 flex h-12 items-end gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={cn('w-4 rounded-t border border-ink', color)}
            style={{ height: `${40 + i * 10}%` }}
          />
        ))}
      </div>
    </div>
  )
}
