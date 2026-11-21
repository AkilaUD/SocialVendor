import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Banknote,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Ticket,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Pictogram } from '@/components/kade/Pictogram'
import type { PictogramId } from '@/assets/pictograms'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { CoachOverlay } from '@/components/common/CoachOverlay'
import { useAppStore } from '@/stores/useAppStore'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { useT } from '@/i18n'
import { cn, formatLkr } from '@/lib/utils'

type NavItem = {
  to: string
  labelKey: string
  icon: typeof LayoutDashboard
  end?: boolean
}

type EasyNavItem = {
  to: string
  labelKey: string
  pictogram: PictogramId
  end?: boolean
}

const primaryNav: NavItem[] = [
  { to: '/app', labelKey: 'nav.today', icon: LayoutDashboard, end: true },
  { to: '/app/orders', labelKey: 'nav.orders', icon: ShoppingBag },
  { to: '/app/dispatch', labelKey: 'nav.dispatch', icon: Truck },
  { to: '/app/cod', labelKey: 'nav.cod', icon: Banknote },
]

/** Core Easy desk: Today · Parcels · New · Pack · Money (More via header). */
const easyNavLeft: EasyNavItem[] = [
  { to: '/app', labelKey: 'nav.today', pictogram: 'purse', end: true },
  { to: '/app/orders', labelKey: 'nav.orders', pictogram: 'parcel' },
]

const easyNavRight: EasyNavItem[] = [
  { to: '/app/dispatch', labelKey: 'nav.dispatch', pictogram: 'bike' },
  { to: '/app/cod', labelKey: 'nav.money', pictogram: 'coin' },
]

const moreItems: NavItem[] = [
  { to: '/app/payments', labelKey: 'nav.payments', icon: Building2 },
  { to: '/app/customers', labelKey: 'nav.customers', icon: Users },
  { to: '/app/products', labelKey: 'nav.products', icon: Package },
  { to: '/app/inventory', labelKey: 'nav.inventory', icon: Boxes },
  { to: '/app/returns', labelKey: 'nav.returns', icon: ClipboardList },
  { to: '/app/invoices', labelKey: 'nav.invoices', icon: FileText },
  { to: '/app/expenses', labelKey: 'nav.expenses', icon: Receipt },
  { to: '/app/tickets', labelKey: 'nav.tickets', icon: Ticket },
  { to: '/app/settings', labelKey: 'nav.settings', icon: Settings },
]

const navGroups: Array<{ labelKey: string; items: NavItem[] }> = [
  {
    labelKey: 'nav.sell',
    items: [
      { to: '/app/customers', labelKey: 'nav.customers', icon: Users },
      { to: '/app/products', labelKey: 'nav.products', icon: Package },
      { to: '/app/inventory', labelKey: 'nav.inventory', icon: Boxes },
    ],
  },
  {
    labelKey: 'nav.moneyCare',
    items: [
      { to: '/app/payments', labelKey: 'nav.payments', icon: Building2 },
      { to: '/app/returns', labelKey: 'nav.returns', icon: ClipboardList },
      { to: '/app/invoices', labelKey: 'nav.invoices', icon: FileText },
      { to: '/app/expenses', labelKey: 'nav.expenses', icon: Receipt },
      { to: '/app/tickets', labelKey: 'nav.tickets', icon: Ticket },
      { to: '/app/settings', labelKey: 'nav.settings', icon: Settings },
    ],
  },
]

function NavLinkItem({
  item,
  onNavigate,
  t,
  large,
}: {
  item: NavItem
  onNavigate?: () => void
  t: (key: string) => string
  large?: boolean
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
          large ? 'min-h-12 py-3' : 'py-2.5',
          isActive
            ? 'bg-white/15 text-white'
            : 'text-white/65 hover:bg-white/5 hover:text-white',
        )
      }
    >
      <item.icon className={cn('shrink-0', large ? 'h-5 w-5' : 'h-4 w-4')} />
      <span className="min-w-0 leading-snug">{t(item.labelKey)}</span>
    </NavLink>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()
  const t = useT()
  const simpleMode = useLocaleStore((s) => s.simpleMode)
  const tenant = useAppStore((s) => s.tenant)
  const notifications = useAppStore((s) => s.notifications)
  const markNotificationRead = useAppStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead)
  const logout = useAppStore((s) => s.logout)
  const orders = useAppStore((s) => s.orders)

  const unread = notifications.filter((n) => !n.read).length
  const todaysCod = useMemo(
    () =>
      orders
        .filter((o) => ['dispatched', 'delivered'].includes(o.status) && o.codAmount > 0)
        .reduce((sum, o) => sum + o.codAmount, 0),
    [orders],
  )

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-4 px-2">
      <div className="flex flex-col gap-0.5">
        {primaryNav.map((item) => (
          <NavLinkItem
            key={item.to}
            item={item}
            onNavigate={onNavigate}
            t={t}
            large={simpleMode}
          />
        ))}
      </div>
      {navGroups.map((group) => (
        <div key={group.labelKey}>
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {t(group.labelKey)}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavLinkItem
                key={item.to}
                item={item}
                onNavigate={onNavigate}
                t={t}
                large={simpleMode}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[minmax(240px,280px)_1fr]">
      <aside className="hidden ink-wash lg:flex lg:flex-col lg:border-r lg:border-white/10">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 font-display text-sm font-bold text-on-ink">
            {tenant.logoInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-white">{tenant.businessName}</p>
            <p className="truncate text-[11px] uppercase tracking-wider text-white/45">
              {tenant.plan} plan
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-4">
          <NavItems />
        </div>
        <div className="border-t border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-wider text-white/45">{t('today.codInFlight')}</p>
          <p className="mt-1 font-display text-lg font-bold text-cash">{formatLkr(todaysCod)}</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-2 border-b border-line bg-paper/90 px-3 py-2 backdrop-blur sm:gap-3 sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-paper-2 lg:hidden"
              onClick={() => (simpleMode ? setMoreOpen(true) : setMobileOpen(true))}
              aria-label={simpleMode ? t('common.more') : 'Open navigation'}
            >
              {simpleMode ? (
                <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs text-muted">
                {t('today.hi', { name: tenant.ownerName.split(' ')[0] })}
              </p>
              <p className="truncate text-sm font-semibold">
                {t('today.desk')} ·{' '}
                {new Date().toLocaleDateString('en-LK', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher compact className="hidden sm:inline-flex" />
            <div className="hidden md:block">
              <ThemeSwitcher compact />
            </div>
            <Button
              asChild
              size="icon"
              variant="cash"
              className="sm:hidden"
              aria-label={t('nav.quickOrder')}
            >
              <Link to="/app/orders/new">
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size={simpleMode ? 'default' : 'sm'}
              variant="cash"
              className="hidden sm:inline-flex"
            >
              <Link to="/app/orders/new">{t('nav.quickOrder')}</Link>
            </Button>
            <div className="relative">
              <Button
                size="icon"
                variant="outline"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((v) => !v)}
              >
                <Bell className="h-4 w-4" />
              </Button>
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Sign out"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main
          className={cn(
            'min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6',
            simpleMode && 'pb-28 lg:pb-6',
          )}
        >
          <Outlet />
        </main>
      </div>

      <CoachOverlay />

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {notifOpen ? (
                <>
                  <motion.button
                    key="notif-backdrop"
                    type="button"
                    aria-label="Close notifications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-ink/25"
                    onClick={() => setNotifOpen(false)}
                  />
                  <motion.div
                    key="notif-panel"
                    role="dialog"
                    aria-label="Notifications"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="fixed inset-x-3 top-[4.25rem] z-[70] max-h-[min(70vh,28rem)] overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-float)] sm:inset-x-auto sm:right-4 sm:w-[22rem]"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                      <p className="min-w-0 text-sm font-semibold">Notifications</p>
                      <button
                        type="button"
                        className="shrink-0 text-xs font-medium text-lagoon hover:underline"
                        onClick={markAllNotificationsRead}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          className={cn(
                            'block w-full border-b border-line/70 px-4 py-3 text-left hover:bg-paper',
                            !n.read && 'bg-lagoon/10',
                          )}
                          onClick={() => {
                            markNotificationRead(n.id)
                            setNotifOpen(false)
                            if (n.href) navigate(n.href)
                          }}
                        >
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {simpleMode ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-surface px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 lg:hidden">
          <div className="grid grid-cols-5 items-end gap-0.5">
            {easyNavLeft.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[10px] font-extrabold leading-tight sm:text-[11px]',
                    isActive ? 'bg-cash text-ink' : 'text-muted',
                  )
                }
              >
                <Pictogram id={item.pictogram} className="h-8 w-8" />
                <span className="max-w-full whitespace-normal text-center line-clamp-2">
                  {t(item.labelKey)}
                </span>
              </NavLink>
            ))}
            <Link
              to="/app/orders/new"
              className="-mt-5 flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl border-2 border-ink bg-cash px-1 py-2 text-[10px] font-extrabold text-ink shadow-[var(--shadow-desk)] sm:text-[11px]"
              aria-label={t('today.newOrder')}
            >
              <Pictogram id="chat" className="h-9 w-9" />
              <span className="mt-0.5 max-w-full text-center line-clamp-2">{t('today.newOrder')}</span>
            </Link>
            {easyNavRight.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[10px] font-extrabold leading-tight sm:text-[11px]',
                    isActive ? 'bg-cash text-ink' : 'text-muted',
                  )
                }
              >
                <Pictogram id={item.pictogram} className="h-8 w-8" />
                <span className="max-w-full whitespace-normal text-center line-clamp-2">
                  {t(item.labelKey)}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}

      <AnimatePresence>
        {moreOpen && simpleMode ? (
          <>
            <motion.button
              type="button"
              aria-label="Close more menu"
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-2 border-ink bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-float)] lg:hidden"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-extrabold">{t('common.more')}</p>
                <button
                  type="button"
                  className="min-h-11 min-w-11 rounded-md p-2 hover:bg-paper-2"
                  onClick={() => setMoreOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Link
                to="/app/settings?tab=language"
                onClick={() => setMoreOpen(false)}
                className="mb-3 flex min-h-14 items-center gap-3 rounded-xl border-2 border-ink bg-cash/30 px-3 py-3"
              >
                <Pictogram id="speaker" className="h-10 w-10" />
                <div className="min-w-0">
                  <p className="font-extrabold">{t('simple.openEasySettings')}</p>
                  <p className="text-sm text-muted">
                    {simpleMode ? t('simple.on') : t('simple.off')}
                  </p>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                {moreItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-14 items-center gap-3 rounded-xl border-2 border-ink bg-paper px-3 py-3 text-sm font-extrabold"
                  >
                    <item.icon className="h-5 w-5 text-lagoon" />
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <LanguageSwitcher className="flex-1 justify-center" />
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,280px)] flex-col ink-wash lg:hidden"
            >
              <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-4">
                <p className="min-w-0 truncate font-display font-bold text-white">
                  {tenant.businessName}
                </p>
                <button
                  className="min-h-11 min-w-11 shrink-0 rounded-md p-2 text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex shrink-0 flex-col gap-2 px-3 pb-3">
                <LanguageSwitcher className="w-full justify-center border-white/15 bg-white/5" />
                <ThemeSwitcher compact className="w-full justify-center border-white/15 bg-white/5" />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto pb-6">
                <NavItems onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
