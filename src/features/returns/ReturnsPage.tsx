import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { ReturnRecord } from '@/types'

export function ReturnsPage() {
  const t = useT()
  const returns = useAppStore((s) => s.returns)
  const updateReturn = useAppStore((s) => s.updateReturn)

  const grade = (id: string, g: NonNullable<ReturnRecord['grade']>) => {
    updateReturn(id, { grade: g, status: 'inspected' })
    toast.success(`Graded ${g}`)
  }

  return (
    <div>
      <PageHeader
        eyebrow={t('returns.eyebrow')}
        title={t('returns.title')}
        description={t('returns.description')}
        tip={t('returns.tip')}
      />

      <div className="space-y-3">
        {returns.map((r) => (
          <div key={r.id} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">{r.orderNumber}</p>
                <p className="text-sm text-muted">
                  {r.type.toUpperCase()} · {r.reason}
                  {r.waybill ? ` · ${r.waybill}` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{r.status.replace('_', ' ')}</Badge>
                {r.grade ? <Badge variant="lagoon">Grade {r.grade}</Badge> : null}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="min-h-10" onClick={() => grade(r.id, 'A')}>
                {t('returns.gradeA')}
              </Button>
              <Button size="sm" variant="outline" className="min-h-10" onClick={() => grade(r.id, 'B')}>
                {t('returns.gradeB')}
              </Button>
              <Button size="sm" variant="outline" className="min-h-10" onClick={() => grade(r.id, 'C')}>
                {t('returns.gradeC')}
              </Button>
              <Button
                size="sm"
                variant="lagoon"
                onClick={() => {
                  updateReturn(r.id, {
                    status: r.grade === 'C' ? 'written_off' : 'restocked',
                  })
                  toast.success(r.grade === 'C' ? 'Written off' : 'Restocked')
                }}
              >
                {t('returns.complete')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
