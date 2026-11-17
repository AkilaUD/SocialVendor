import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

const channels = ['WhatsApp', 'Facebook', 'Instagram', 'TikTok', 'Daraz'] as const

export function RegisterPage() {
  const t = useT()
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('Lanka Loom Atelier')
  const [phone, setPhone] = useState('0771234567')
  const [selected, setSelected] = useState<string[]>(['WhatsApp', 'Instagram'])
  const login = useAppStore((s) => s.login)
  const updateTenant = useAppStore((s) => s.updateTenant)
  const navigate = useNavigate()

  const finish = () => {
    updateTenant({ businessName, phone })
    login()
    toast.success('Account created — let’s set up your desk')
    navigate('/onboarding')
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">{t('auth.register')}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{t('auth.registerTitle')}</h1>
      <p className="mt-2 text-sm text-muted">{t('auth.stepOf', { step })}</p>

      {step === 1 ? (
        <div className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label>{t('auth.businessName')}</Label>
            <Input
              className="min-h-11"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('auth.ownerMobile')}</Label>
            <Input className="min-h-11" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button
            className="w-full min-h-12"
            variant="lagoon"
            onClick={() => setStep(2)}
            disabled={!businessName || !phone}
          >
            {t('auth.continue')}
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <Label>{t('auth.channels')}</Label>
          <div className="flex flex-wrap gap-2">
            {channels.map((c) => {
              const on = selected.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => (on ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                  className={cn(
                    'min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                    on ? 'border-lagoon bg-mint/25 text-ink' : 'border-line bg-surface text-muted',
                  )}
                >
                  {c}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="min-h-11 flex-1" onClick={() => setStep(1)}>
              {t('common.back')}
            </Button>
            <Button
              className="min-h-11 flex-1"
              variant="cash"
              onClick={finish}
              disabled={selected.length === 0}
            >
              {t('auth.createDesk')}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.already')}{' '}
        <Link to="/login" className="font-semibold text-lagoon hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  )
}
