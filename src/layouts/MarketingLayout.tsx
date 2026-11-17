import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

export function MarketingLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const t = useT()

  const links = [
    { to: '/#who', label: t('marketing.who') },
    { to: '/#how', label: t('marketing.how') },
    { to: '/#rto', label: t('marketing.rto') },
    { to: '/pricing', label: t('marketing.pricing') },
    { to: '/login', label: t('marketing.signIn') },
  ]

  return (
    <div className="min-h-screen paper-noise text-ink">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-on-ink">
              SO
            </span>
            <span className="hidden truncate font-display text-lg font-bold tracking-tight min-[380px]:inline">
              {t('brand.name')}
            </span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'text-sm font-medium text-muted transition hover:text-ink',
                  location.pathname === l.to && 'text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
            <LanguageSwitcher compact />
            <ThemeSwitcher compact />
            <Button asChild variant="lagoon" className="min-h-11">
              <Link to="/register">{t('common.startFree')}</Link>
            </Button>
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
            <LanguageSwitcher compact />
            <ThemeSwitcher compact className="hidden min-[420px]:inline-flex" />
            <button
              className="min-h-11 min-w-11 rounded-md p-2 text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line lg:hidden"
            >
              <div className="flex flex-col gap-2 px-4 py-4">
                <div className="mb-1 min-[420px]:hidden">
                  <ThemeSwitcher compact className="w-full justify-center" />
                </div>
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="min-h-11 rounded-md px-3 py-2 text-sm font-medium hover:bg-paper-2"
                  >
                    {l.label}
                  </Link>
                ))}
                <Button asChild variant="lagoon" className="mt-1 min-h-11">
                  <Link to="/register" onClick={() => setOpen(false)}>
                    {t('common.startFree')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <Outlet />
      <footer className="border-t border-line bg-ink text-on-ink/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-on-ink">{t('brand.name')}</p>
            <p className="mt-1 text-sm text-on-ink/60">{t('marketing.heroBody')}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/pricing" className="hover:text-on-ink">
              {t('marketing.pricing')}
            </Link>
            <Link to="/track/KOOM-552101" className="hover:text-on-ink">
              Track demo
            </Link>
            <Link to="/store/lanka-loom" className="hover:text-on-ink">
              Mini-store
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
