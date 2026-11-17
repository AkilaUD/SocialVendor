import { Link, Outlet } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useT } from '@/i18n'

export function AuthLayout() {
  const t = useT()

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden ink-wash text-mint lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="absolute inset-0 desk-grid opacity-30" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/15 font-display text-sm font-bold text-mint">
            SO
          </span>
          <span className="font-display text-lg font-bold">{t('brand.name')}</span>
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cash">
            Chat → parcel → cash
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-white">
            {t('marketing.heroTitle')}
          </h1>
          <p className="mt-4 text-mint/75">{t('marketing.heroBody')}</p>
        </div>
        <p className="relative z-10 text-sm text-mint/50">Demo tenant: Lanka Loom Atelier · Growth plan</p>
      </aside>
      <main className="flex items-center justify-center bg-paper px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-end">
            <LanguageSwitcher compact />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
