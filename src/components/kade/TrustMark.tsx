import { Pictogram } from '@/components/kade/Pictogram'
import { cn } from '@/lib/utils'

export function TrustMark({
  level,
  label,
}: {
  level: 'low' | 'medium' | 'high'
  label: string
}) {
  const ok = level === 'low'
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border-2 border-ink px-3 py-2',
        ok ? 'bg-ok/15' : 'bg-risk/15',
      )}
    >
      <Pictogram id={ok ? 'stamp' : 'hand'} className="h-8 w-8" />
      <span className="text-sm font-extrabold">{label}</span>
    </div>
  )
}
