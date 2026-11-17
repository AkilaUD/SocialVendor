import { toast } from 'sonner'
import { Home, PhoneOff, MapPin, ThumbsDown } from 'lucide-react'
import { Stamp } from '@/components/kade/Stamp'
import { BigButton } from '@/components/kade/BigButton'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { ReturnRecord } from '@/types'

const reasons = [
  { id: 'home', icon: Home, label: 'Not at home' },
  { id: 'no', icon: ThumbsDown, label: 'Said no' },
  { id: 'addr', icon: MapPin, label: 'Wrong address' },
  { id: 'phone', icon: PhoneOff, label: 'Phone off' },
] as const

export function ReturnsPage() {
  const t = useT()
  const returns = useAppStore((s) => s.returns)
  const updateReturn = useAppStore((s) => s.updateReturn)

  const grade = (id: string, g: NonNullable<ReturnRecord['grade']>) => {
    updateReturn(id, { grade: g, status: 'inspected' })
    toast.success(t('kade.correct'))
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{t('kade.cameBack')}</h1>

      <div className="grid grid-cols-2 gap-3">
        {reasons.map((r) => (
          <div
            key={r.id}
            className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-ink bg-surface p-3 text-center"
          >
            <r.icon className="h-10 w-10 text-risk" strokeWidth={2.5} />
            <p className="text-sm font-extrabold leading-snug">{r.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {returns.map((r) => (
          <div key={r.id} className="parcel-tag relative p-4">
            <p className="font-money text-sm text-muted">{r.orderNumber}</p>
            <p className="mt-1 text-lg font-extrabold">{r.reason}</p>
            <div className="absolute right-3 top-3">
              <Stamp label={t('kade.stampBack')} kind="returned" show />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(['A', 'B', 'C'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className="min-h-14 rounded-xl border-2 border-ink bg-paper text-lg font-extrabold"
                  onClick={() => grade(r.id, g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <BigButton
                tone="done"
                speakText={t('returns.complete')}
                onClick={() => {
                  updateReturn(r.id, {
                    status: r.grade === 'C' ? 'written_off' : 'restocked',
                  })
                  toast.success(t('common.done'))
                }}
              >
                {t('returns.complete')}
              </BigButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
