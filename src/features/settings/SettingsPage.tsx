import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { THEMES, useThemeStore } from '@/stores/useThemeStore'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

type TabId = 'business' | 'bank' | 'theme' | 'language' | 'team' | 'notifications' | 'policy'

export function SettingsPage() {
  const t = useT()
  const [tab, setTab] = useState<TabId>('business')
  const tenant = useAppStore((s) => s.tenant)
  const team = useAppStore((s) => s.team)
  const updateTenant = useAppStore((s) => s.updateTenant)
  const theme = useThemeStore((s) => s.theme)
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const setSimpleMode = useLocaleStore((s) => s.setSimpleMode)
  const [businessName, setBusinessName] = useState(tenant.businessName)
  const [email, setEmail] = useState(tenant.email)
  const [registrationNo, setRegistrationNo] = useState(tenant.registrationNo ?? '')
  const [policy, setPolicy] = useState(tenant.returnPolicy)
  const [bankName, setBankName] = useState(tenant.bankAccount.bankName)
  const [accountName, setAccountName] = useState(tenant.bankAccount.accountName)
  const [accountNumber, setAccountNumber] = useState(tenant.bankAccount.accountNumber)
  const [branch, setBranch] = useState(tenant.bankAccount.branch)

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'business', label: t('settings.business') },
    { id: 'bank', label: t('settings.bank') },
    { id: 'theme', label: t('settings.theme') },
    { id: 'language', label: t('settings.language') },
    { id: 'team', label: t('settings.team') },
    { id: 'notifications', label: t('settings.notifications') },
    { id: 'policy', label: t('settings.policy') },
  ]

  return (
    <div>
      <PageHeader
        eyebrow={t('settings.eyebrow')}
        title={t('nav.shop')}
        description={t('settings.description')}
        tip={t('settings.tip')}
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <a
          href={`tel:${tenant.phone}`}
          className="flex min-h-20 flex-col items-center justify-center rounded-xl border-2 border-ink bg-ok text-lg font-extrabold text-white"
        >
          Call us
        </a>
        <a
          href={`https://wa.me/94${tenant.phone.replace(/\D/g, '').slice(-9)}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-20 flex-col items-center justify-center rounded-xl border-2 border-ink bg-cash text-lg font-extrabold text-ink"
        >
          WhatsApp us
        </a>
      </div>

      <div className="mb-5 flex max-w-full gap-1 overflow-x-auto pb-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
              tab === item.id ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-muted',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'business' ? (
        <div className="max-w-xl space-y-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div className="space-y-1.5">
            <Label>{t('settings.businessName')}</Label>
            <Input
              className="min-h-11"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('settings.email')}</Label>
            <Input className="min-h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('settings.regNo')}</Label>
            <Input
              className="min-h-11"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted">
            Plan: {tenant.plan} · Languages: {tenant.languages.join(', ')}
          </p>
          <Button
            variant="lagoon"
            className="min-h-11"
            onClick={() => {
              updateTenant({ businessName, email, registrationNo })
              toast.success('Business profile saved')
            }}
          >
            {t('settings.saveProfile')}
          </Button>
        </div>
      ) : null}

      {tab === 'bank' ? (
        <div className="max-w-xl space-y-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <p className="text-sm text-muted">{t('settings.bankHint')}</p>
          <div className="space-y-1.5">
            <Label>{t('settings.bankName')}</Label>
            <Input className="min-h-11" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('settings.accountName')}</Label>
            <Input
              className="min-h-11"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('settings.accountNumber')}</Label>
            <Input
              className="min-h-11"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('settings.branch')}</Label>
            <Input className="min-h-11" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>
          <Button
            variant="lagoon"
            className="min-h-11"
            onClick={() => {
              updateTenant({
                bankAccount: { bankName, accountName, accountNumber, branch },
              })
              toast.success('Bank account saved')
            }}
          >
            {t('settings.saveBank')}
          </Button>
        </div>
      ) : null}

      {tab === 'theme' ? (
        <div className="max-w-xl space-y-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div>
            <h2 className="font-display text-lg font-bold">{t('settings.colorTheme')}</h2>
            <p className="mt-1 text-sm text-muted">
              Current: <strong>{theme}</strong>.
            </p>
          </div>
          <ThemeSwitcher />
          <ul className="space-y-2 text-sm text-muted">
            {THEMES.map((item) => (
              <li key={item.id} className="rounded-lg border border-line bg-paper px-3 py-2">
                <span className="font-semibold text-ink">{item.label}</span> — {item.hint}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === 'language' ? (
        <div className="max-w-xl space-y-5 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div>
            <h2 className="font-display text-lg font-bold">{t('settings.language')}</h2>
            <p className="mt-1 text-sm text-muted">{t('lang.pickHint')}</p>
            <div className="mt-3">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="font-semibold text-ink">
              {simpleMode ? t('simple.on') : t('simple.off')}
            </p>
            <p className="mt-1 text-sm text-muted">{t('simple.hint')}</p>
            <Button
              className="mt-3 min-h-11"
              variant={simpleMode ? 'outline' : 'lagoon'}
              onClick={() => setSimpleMode(!simpleMode)}
            >
              {simpleMode ? t('simple.turnOff') : t('simple.turnOn')}
            </Button>
          </div>
        </div>
      ) : null}

      {tab === 'team' ? (
        <div className="rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border-b border-line/70 px-4 py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-muted">{m.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-lagoon">
                  {m.role.replace('_', ' ')}
                </p>
                <p className="text-xs text-muted">{m.active ? 'Active' : 'Off'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'notifications' ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              title: 'Order confirmation',
              body: 'Hi {{name}}, your order {{number}} totals {{total}}. Reply YES to confirm.',
            },
            {
              title: 'Dispatched',
              body: 'Parcel {{waybill}} is with {{courier}}. Track: {{link}}',
            },
            {
              title: 'Failed attempt',
              body: 'We couldn’t deliver {{number}}. Please call us to reschedule.',
            },
            {
              title: 'Review request',
              body: 'How was your order? Tap to rate 1–5.',
            },
          ].map((tpl) => (
            <div
              key={tpl.title}
              className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-desk)]"
            >
              <p className="text-sm font-semibold">{tpl.title}</p>
              <p className="mt-2 rounded-lg bg-paper p-3 text-sm text-muted">{tpl.body}</p>
              <Button
                size="sm"
                className="mt-3 min-h-10"
                variant="outline"
                onClick={() => toast.message('Template preview queued (EN / SI / TA)')}
              >
                Preview languages
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'policy' ? (
        <div className="max-w-2xl space-y-3 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <Label>{t('settings.returnPolicy')}</Label>
          <Textarea rows={5} value={policy} onChange={(e) => setPolicy(e.target.value)} />
          <Button
            variant="lagoon"
            className="min-h-11"
            onClick={() => {
              updateTenant({ returnPolicy: policy })
              toast.success('Return policy updated')
            }}
          >
            {t('settings.savePolicy')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
