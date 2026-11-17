import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Factory,
  MessageSquareText,
  Package,
  ShieldAlert,
  Smartphone,
  Store,
  Truck,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
}

export function LandingPage() {
  const t = useT()
  const heroRef = useRef<HTMLElement>(null)
  const [orders, setOrders] = useState(200)
  const [aov, setAov] = useState(3500)
  const [rtoNow, setRtoNow] = useState(20)
  const [rtoTarget, setRtoTarget] = useState(10)
  const [courierCost, setCourierCost] = useState(600)
  const [packingCost, setPackingCost] = useState(75)
  const [deskTab, setDeskTab] = useState<'orders' | 'pack' | 'cash'>('orders')

  const lossNow = orders * (rtoNow / 100) * (courierCost + packingCost)
  const lossTarget = orders * (rtoTarget / 100) * (courierCost + packingCost)
  const saving = lossNow - lossTarget
  const refusedSales = orders * (rtoNow / 100) * aov

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-brand', { y: 28, opacity: 0, duration: 0.75 })
          .from('.hero-line', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
          .from('.hero-cta', { y: 16, opacity: 0, duration: 0.5 }, '-=0.25')
          .from('.hero-panel', { y: 36, opacity: 0, duration: 0.75 }, '-=0.4')
      })
      return () => mm.revert()
    },
    { scope: heroRef },
  )

  return (
    <div>
      {/* 1. Hero */}
      <section ref={heroRef} className="relative overflow-hidden ink-wash text-white">
        <div className="absolute inset-0 desk-grid opacity-20" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-6 md:py-24 lg:py-28">
          <div>
            <p className="hero-brand font-display text-4xl font-extrabold tracking-tight text-on-ink sm:text-5xl md:text-6xl">
              {t('brand.name')}
            </p>
            <h1 className="hero-line mt-5 max-w-xl font-display text-2xl font-bold leading-snug text-white sm:text-3xl md:text-[2.1rem]">
              {t('marketing.heroTitle')}
            </h1>
            <p className="hero-line mt-4 max-w-lg text-base text-white/70 sm:text-lg">
              {t('marketing.heroBody')}
            </p>
            <div className="hero-cta mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="cash" className="min-h-12">
                <Link to="/register">
                  {t('common.startFree')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="soft" className="min-h-12 border border-white/15 bg-white/10 text-white hover:bg-white/20">
                <Link to="/login">{t('marketing.tryDemo')}</Link>
              </Button>
            </div>
            <p className="hero-line mt-5 text-sm text-white/50">
              {t('marketing.freeNote')}
            </p>
          </div>

          <div className="hero-panel rounded-2xl border border-white/12 bg-black/25 p-4 shadow-[var(--shadow-float)] sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cash">
              {t('marketing.previewTitle')}
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: t('marketing.previewNew'),
                  value: t('marketing.previewNewValue'),
                  tone: 'text-on-ink',
                },
                {
                  label: t('marketing.previewRisk'),
                  value: t('marketing.previewRiskValue'),
                  tone: 'text-cash',
                },
                {
                  label: t('marketing.previewCash'),
                  value: t('marketing.previewCashValue'),
                  tone: 'text-white',
                },
              ].map((row) => (
                <div key={row.label} className="rounded-xl border border-white/10 bg-black/25 px-3.5 py-3">
                  <p className="text-[11px] tracking-wide text-white/45">{row.label}</p>
                  <p className={`mt-1 text-sm font-semibold leading-snug ${row.tone}`}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who it's for */}
      <section id="who" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div {...fadeUp}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">Who it’s for</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold text-ink md:text-4xl">
            Built for people who sell in chats — not spreadsheets.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Store,
              title: 'Solo resellers',
              body: 'One phone, Facebook + WhatsApp, 30–300 orders a month. Capture fast, print waybills, see what’s unpaid.',
            },
            {
              icon: Factory,
              title: 'Makers & home brands',
              body: 'Clothing, cakes, crafts. Track what you make, what you ship, and what returns really cost.',
            },
            {
              icon: BookOpen,
              title: 'Book sellers',
              body: 'ISBN, condition, pre-orders. Keep stock honest when half your “warehouse” is a bookshelf.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-desk)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-on-ink">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. The mess today */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">The mess today</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold text-ink">
              Every order jumps four apps before you get paid.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '01', t: 'DM arrives', d: 'Name and address live in WhatsApp' },
              { n: '02', t: 'Retype to Excel', d: 'Orders missed, stock wrong' },
              { n: '03', t: 'Courier portal', d: 'Phone & COD typed again' },
              { n: '04', t: 'Cash mystery', d: 'Which waybill was remitted?' },
            ].map((step, i) => (
              <div key={step.n} className="relative rounded-2xl border border-line bg-paper p-5">
                <p className="font-display text-3xl font-extrabold text-lagoon/30">{step.n}</p>
                <p className="mt-2 font-display text-lg font-bold">{step.t}</p>
                <p className="mt-1 text-sm text-muted">{step.d}</p>
                {i < 3 ? (
                  <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-lagoon lg:block">→</span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted md:text-base">
            Doorstep refusals (RTO) quietly eat courier fees and packing twice. Social Seller OS closes that loop in one desk.
          </p>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div {...fadeUp}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">Four steps. Then go home.</h2>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            {
              icon: MessageSquareText,
              title: '1. Capture',
              body: 'Paste a chat. We pull name, phone and address. One tap creates the order.',
            },
            {
              icon: ShieldAlert,
              title: '2. Check risk',
              body: 'Past RTOs and new high-value COD get flagged. Ask advance before you pack.',
            },
            {
              icon: Truck,
              title: '3. Dispatch',
              body: 'Pick list, pack photo, waybill — Domex, Koombiyo or CSV. No retyping.',
            },
            {
              icon: Wallet,
              title: '4. Match cash',
              body: 'Import remittance sheets. Match per waybill. See what’s still outstanding.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lagoon/15 text-lagoon">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Product tour */}
      <section id="features" className="border-y border-line bg-paper-2/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">Product tour</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Your desk, not another dashboard.</h2>
            <p className="mt-2 max-w-xl text-muted">Tap a tab — see the three things a seller actually does every day.</p>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                { id: 'orders' as const, label: 'Capture orders', icon: Package },
                { id: 'pack' as const, label: 'Pack & send', icon: Truck },
                { id: 'cash' as const, label: 'Collect COD', icon: Wallet },
              ]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDeskTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  deskTab === tab.id
                    ? 'bg-ink text-on-ink'
                    : 'border border-line bg-surface text-muted hover:text-ink'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-desk)]">
            <div className="ink-wash px-5 py-4 text-sm font-semibold text-white">
              Lanka Loom Atelier · demo desk
            </div>
            <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
              <div className="space-y-3 border-b border-line p-5 md:border-b-0 md:border-r">
                {deskTab === 'orders' ? (
                  <>
                    <p className="text-sm font-semibold text-ink">New from WhatsApp</p>
                    <p className="rounded-xl bg-paper p-3 text-sm">LL-10482 · Dilani · M Teal dress · COD {formatLkr(4550)}</p>
                    <p className="rounded-xl bg-cash/20 p-3 text-sm">On hold · Fathima · ask advance first</p>
                    <p className="text-xs text-muted">Tip: paste the chat → Quick order does the typing.</p>
                  </>
                ) : null}
                {deskTab === 'pack' ? (
                  <>
                    <p className="text-sm font-semibold text-ink">Before 12:00 cut-off</p>
                    <p className="rounded-xl bg-paper p-3 text-sm">2 orders ready to pack · Negombo + Colombo</p>
                    <p className="rounded-xl bg-paper p-3 text-sm">Create waybill → Koombiyo / Domex / CSV</p>
                    <p className="text-xs text-muted">Tip: one screen for pick, pack, label, handover.</p>
                  </>
                ) : null}
                {deskTab === 'cash' ? (
                  <>
                    <p className="text-sm font-semibold text-ink">Monday remittance</p>
                    <p className="rounded-xl bg-paper p-3 text-sm">2 Domex lines unmatched · {formatLkr(5630)}</p>
                    <p className="rounded-xl bg-ok/10 p-3 text-sm text-ok">KOOM-552101 matched · closed</p>
                    <p className="text-xs text-muted">Tip: match per waybill — never by vague totals.</p>
                  </>
                ) : null}
              </div>
              <div className="flex flex-col justify-center gap-3 p-5">
                <h3 className="font-display text-2xl font-bold text-ink">
                  {deskTab === 'orders' && 'Stop losing orders in chat'}
                  {deskTab === 'pack' && 'Ship without retyping'}
                  {deskTab === 'cash' && 'Know which cash came back'}
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  {(deskTab === 'orders'
                    ? ['Paste-to-parse from DMs', 'Customer risk by your own history', 'Confirm before stock locks']
                    : deskTab === 'pack'
                      ? ['Daily cut-off pack list', 'Waybills without portal copy-paste', 'Failed attempt → call task']
                      : ['Import courier remittance CSV', 'Outstanding COD by age', 'Profit after courier + returns']
                  ).map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" />
                      {line}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="lagoon" className="mt-2 w-fit">
                  <Link to="/login">Open this desk</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RTO calculator */}
      <section id="rto" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">Prove it in LKR</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">How much RTO costs you</h2>
            <p className="mt-3 text-muted">
              Failed deliveries cost courier fees twice and lock your stock. Change the numbers — see the saving if you cut RTO.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)] md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Orders each month', value: orders, set: setOrders },
                { label: 'Average order value', value: aov, set: setAov },
                { label: 'Your RTO % now', value: rtoNow, set: setRtoNow },
                { label: 'Target RTO %', value: rtoTarget, set: setRtoTarget },
                { label: 'Courier cost if refused', value: courierCost, set: setCourierCost },
                { label: 'Packing cost / parcel', value: packingCost, set: setPackingCost },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label>{field.label}</Label>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.set(Number(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-risk/10 p-4">
                <p className="text-xs font-semibold uppercase text-risk">You lose now</p>
                <p className="mt-1 font-display text-2xl font-bold">{formatLkr(lossNow)}</p>
              </div>
              <div className="rounded-xl bg-ok/10 p-4">
                <p className="text-xs font-semibold uppercase text-ok">Save at target</p>
                <p className="mt-1 font-display text-2xl font-bold">{formatLkr(saving)}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">
              Sales refused at the door: <strong className="text-ink">{formatLkr(refusedSales)}</strong>
            </p>
            <Button asChild className="mt-5" variant="lagoon">
              <Link to="/register">Start free and keep this number</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Trust */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wallet, t: 'COD-first', d: 'Designed for doorstep cash, not card checkout cosplay' },
              { icon: Smartphone, t: 'Phone-ready PWA', d: 'Install on Android or iPhone home screen' },
              { icon: MessageSquareText, t: 'SI / TA / EN', d: 'Templates ready for Sinhala, Tamil and English' },
              { icon: Package, t: 'LKR pricing', d: 'Free → Starter from LKR 2,490 — no USD sticker shock' },
            ].map((item) => (
              <div key={item.t} className="rounded-xl border border-line bg-paper p-4">
                <item.icon className="h-5 w-5 text-lagoon" />
                <p className="mt-3 font-display text-lg font-bold">{item.t}</p>
                <p className="mt-1 text-sm text-muted">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="ink-wash">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              {t('marketing.finalTitle')}
            </h2>
            <p className="mt-3 max-w-xl text-white/65">
              {t('marketing.finalBody')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="cash">
              <Link to="/register">{t('marketing.createFree')}</Link>
            </Button>
            <Button asChild size="lg" variant="soft" className="border border-white/15 bg-white/10 text-white hover:bg-white/20">
              <Link to="/login">Try demo desk</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
