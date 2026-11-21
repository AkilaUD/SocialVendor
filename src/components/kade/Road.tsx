import { Pictogram } from '@/components/kade/Pictogram'
import type { PictogramId } from '@/assets/pictograms'
import { cn } from '@/lib/utils'

export type RoadStop = 'table' | 'bag' | 'bike' | 'door' | 'money'

/** Picture story of one parcel — not nav labels. Same words in SI/EN/TA. */
const stops: Array<{ id: RoadStop; pictogram: PictogramId; labelKey: string }> = [
  { id: 'table', pictogram: 'parcel', labelKey: 'road.table' }, // on the desk / මේසය
  { id: 'bag', pictogram: 'parcel', labelKey: 'road.bag' }, // packed bag / බෑග්
  { id: 'bike', pictogram: 'bike', labelKey: 'road.bike' }, // with courier / බයික්
  { id: 'door', pictogram: 'door', labelKey: 'road.door' }, // at buyer / දොර
  { id: 'money', pictogram: 'coin', labelKey: 'road.money' }, // cash in / සල්ලි
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
              <Pictogram id={stop.pictogram} className="h-8 w-8" />
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
