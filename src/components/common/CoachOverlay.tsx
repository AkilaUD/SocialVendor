import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/useThemeStore'
import { useT } from '@/i18n'

export function CoachOverlay() {
  const dismissed = useThemeStore((s) => s.coachDismissed)
  const dismissCoach = useThemeStore((s) => s.dismissCoach)
  const t = useT()

  if (dismissed) return null

  const steps = [
    {
      title: t('coach.step1Title'),
      body: t('coach.step1Body'),
      href: '/app/orders/new',
      cta: t('coach.step1Cta'),
    },
    {
      title: t('coach.step2Title'),
      body: t('coach.step2Body'),
      href: '/app/dispatch',
      cta: t('coach.step2Cta'),
    },
    {
      title: t('coach.step3Title'),
      body: t('coach.step3Body'),
      href: '/app/cod',
      cta: t('coach.step3Cta'),
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-labelledby="coach-title"
        className="flex max-h-[min(90vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-float)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 p-5 pb-0 sm:p-6 sm:pb-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">
              {t('coach.title')}
            </p>
            <h2 id="coach-title" className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">
              {t('coach.subtitle')}
            </h2>
          </div>
          <button
            type="button"
            className="min-h-11 min-w-11 shrink-0 rounded-md p-1.5 text-muted hover:bg-paper-2 hover:text-ink"
            aria-label="Dismiss tour"
            onClick={dismissCoach}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={step.href} className="rounded-xl border border-line bg-paper p-3">
                <p className="text-sm font-bold text-ink">
                  <span className="text-lagoon">{i + 1}.</span> {step.title}
                </p>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
                <Button asChild size="sm" variant="soft" className="mt-2 min-h-11">
                  <Link to={step.href} onClick={dismissCoach}>
                    {step.cta}
                  </Link>
                </Button>
              </li>
            ))}
          </ol>
        </div>
        <div className="shrink-0 border-t border-line p-5 pt-4 sm:px-6">
          <Button className="w-full min-h-12" variant="lagoon" onClick={dismissCoach}>
            {t('coach.dismiss')}
          </Button>
        </div>
      </div>
    </div>
  )
}
