import { Pictogram } from '@/components/kade/Pictogram'
import { formatLkr } from '@/lib/utils'

export function Purse({
  amount,
  label,
}: {
  amount: number
  label: string
}) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-lagoon p-5 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cash">
          <Pictogram id="purse" className="h-12 w-12" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-white/85">{label}</p>
          <p className="font-money text-4xl leading-none text-cash sm:text-5xl">
            {formatLkr(amount)}
          </p>
        </div>
      </div>
    </div>
  )
}
