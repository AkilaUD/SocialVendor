import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'

const schema = z.object({
  phone: z.string().min(9, 'Enter a valid Sri Lankan mobile'),
  otp: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const t = useT()
  const [otpSent, setOtpSent] = useState(false)
  const login = useAppStore((s) => s.login)
  const onboardingDone = useAppStore((s) => s.onboardingDone)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '0771234567', otp: '482913' },
  })

  const enter = () => {
    login()
    toast.success(t('auth.welcome'))
    navigate(onboardingDone ? '/app' : '/onboarding')
  }

  const onSubmit = (values: FormValues) => {
    if (!otpSent) {
      setOtpSent(true)
      toast.message('OTP sent', { description: `Demo code for ${values.phone}: 482913` })
      return
    }
    if (values.otp !== '482913') {
      toast.error('Invalid OTP — use 482913 in the demo')
      return
    }
    enter()
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSwitcher compact />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">{t('auth.signIn')}</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">{t('auth.openDesk')}</h1>
      <p className="mt-2 text-sm text-muted">{t('auth.otpHint')}</p>

      <Button type="button" variant="cash" className="mt-8 w-full min-h-14 text-base" onClick={enter}>
        {t('common.demoDesk')}
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t('auth.mobile')}</Label>
          <Input id="phone" className="min-h-11" placeholder="07X XXX XXXX" {...register('phone')} />
          {errors.phone ? <p className="text-xs text-risk">{errors.phone.message}</p> : null}
        </div>
        {otpSent ? (
          <div className="space-y-1.5">
            <Label htmlFor="otp">{t('auth.otp')}</Label>
            <Input id="otp" className="min-h-11" placeholder="6-digit code" {...register('otp')} />
          </div>
        ) : null}
        <Button type="submit" className="w-full min-h-11" variant="outline">
          {otpSent ? t('auth.verify') : t('auth.sendOtp')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.newSeller')}{' '}
        <Link to="/register" className="font-semibold text-lagoon hover:underline">
          {t('auth.createAccount')}
        </Link>
      </p>
    </div>
  )
}
