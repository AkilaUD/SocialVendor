import { Bike, Home, Package, ShoppingBag, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

export type RoadStop = 'table' | 'bag' | 'bike' | 'door' | 'money'

const stops: Array<{ id: RoadStop; icon: typeof Package; labelKey: string }> = [
  { id: 'table', icon: Package, labelKey: 'road.table' },
  { id: 'bag', icon: ShoppingBag, labelKey: 'road.bag' },
  { id: 'bike', icon: Bike, labelKey: 'road.bike' },
  { id: 'door', icon: Home, labelKey: 'road.door' },
  { id: 'money', icon: Wallet, labelKey: 'road.money' },
]

export function statusToStop(status: string): RoadStop {
  switch (status) {
    case 'new':
    case 'on_hold':
    case 'confirmed':
      return 'table'
    case 'packed':
      return 'bag'
    case 'dispatched':
      return 'bike'
    case 'delivered':
      return 'door'
    case 'paid':
      return 'money'
    case 'rto':
    case 'returned':
    case 'cancelled':
      return 'door'
    default:
      return 'table'
  }
}

export function Road({
  current,
  onSelect,
  t,
}: {
  current: RoadStop
  onSelect?: (stop: RoadStop) => void
  t: (key: string) => string
}) {
  const idx = stops.findIndex((s) => s.id === current)
  return (
    <div className="rounded-xl border-2 border-ink bg-surface p-3">
      <div className="flex items-center justify-between gap-1">
        {stops.map((stop, i) => {
          const Icon = stop.icon
          const active = i === idx
          const done = i < idx
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onSelect?.(stop.id)}
              className={cn(
                'flex min-h-14 min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2',
                active && 'bg-cash text-ink',
                done && !active && 'bg-ok/15 text-ok',
                !active && !done && 'text-muted',
              )}
            >
              <Icon className="h-6 w-6 shrink-0" strokeWidth={2.5} />
              <span className="line-clamp-2 text-center text-[11px] font-extrabold leading-tight">
                {t(stop.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
