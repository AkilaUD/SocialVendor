import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { cn, formatLkr } from '@/lib/utils'

const couriers = ['Domex', 'Koombiyo', 'Pronto', 'CSV only for now']

export function OnboardingPage() {
  const t = useT()
  const [step, setStep] = useState(0)
  const [courier, setCourier] = useState('Koombiyo')
  const [orders, setOrders] = useState(200)
  const [rto, setRto] = useState(18)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const login = useAppStore((s) => s.login)
  const authenticated = useAppStore((s) => s.authenticated)
  const navigate = useNavigate()

  const saving = useMemo(() => orders * ((rto - 10) / 100) * 675, [orders, rto])

  if (!authenticated) {
    login()
  }

  const next = () => {
    if (step < 3) {
      setStep((s) => s + 1)
      return
    }
    completeOnboarding()
    toast.success('Desk ready — today’s queue is waiting')
    navigate('/app')
  }

  return (
    <div className="min-h-screen paper-noise">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-10">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher compact />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">
          {t('onboarding.guided')}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">{t('onboarding.title')}</h1>
        <div className="mt-4 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-lagoon' : 'bg-stone')}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-desk)]">
          {step === 0 ? (
            <div>
              <h2 className="font-display text-xl font-bold">{t('onboarding.importTitle')}</h2>
              <p className="mt-2 text-sm text-muted">{t('onboarding.importBody')}</p>
            </div>
          ) : null}
          {step === 1 ? (
            <div>
              <h2 className="font-display text-xl font-bold">{t('onboarding.courierTitle')}</h2>
              <p className="mt-2 text-sm text-muted">{t('onboarding.courierBody')}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {couriers.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCourier(c)}
                    className={cn(
                      'min-h-11 rounded-lg border px-3 py-2 text-sm font-medium',
                      courier === c ? 'border-lagoon bg-mint/20' : 'border-line',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div>
              <h2 className="font-display text-xl font-bold">{t('onboarding.rtoTitle')}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{t('onboarding.ordersMonth')}</Label>
                  <Input
                    className="min-h-11"
                    type="number"
                    value={orders}
                    onChange={(e) => setOrders(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('onboarding.rtoPct')}</Label>
                  <Input
                    className="min-h-11"
                    type="number"
                    value={rto}
                    onChange={(e) => setRto(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-ok/10 p-4">
                <p className="text-xs font-semibold uppercase text-ok">{t('onboarding.saving')}</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {formatLkr(Math.max(0, saving))}
                </p>
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div>
              <h2 className="font-display text-xl font-bold">{t('onboarding.readyTitle')}</h2>
              <p className="mt-2 text-sm text-muted">
                {t('onboarding.readyBody', { courier })}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex gap-2">
            {step > 0 ? (
              <Button variant="outline" className="min-h-11" onClick={() => setStep((s) => s - 1)}>
                {t('common.back')}
              </Button>
            ) : null}
            <Button className="min-h-11 flex-1" variant="lagoon" onClick={next}>
              {step === 3 ? t('onboarding.enter') : t('common.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
