import { Link } from 'react-router-dom'
import { Stamp } from '@/components/kade/Stamp'
import { cn, formatLkr } from '@/lib/utils'

export function OrderTag({
  to,
  number,
  who,
  where,
  amount,
  stamp,
  stampKind,
  className,
}: {
  to: string
  number: string
  who: string
  where?: string
  amount: number
  stamp?: string
  stampKind?: string
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'parcel-tag relative block min-h-[5.5rem] p-4 shadow-[var(--shadow-desk)] transition active:translate-y-px',
        className,
      )}
    >
      <div className="absolute right-3 top-2 h-3 w-3 rounded-full border-2 border-ink bg-paper" />
      <p className="pr-8 font-money text-sm text-muted">{number}</p>
      <p className="mt-1 text-lg font-extrabold leading-snug">{who}</p>
      {where ? <p className="mt-0.5 text-sm text-muted">{where}</p> : null}
      <p className="mt-2 font-money text-2xl">{formatLkr(amount)}</p>
      {stamp ? (
        <div className="absolute bottom-3 right-3">
          <Stamp label={stamp} kind={stampKind} show />
        </div>
      ) : null}
    </Link>
  )
}
