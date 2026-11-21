import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Stamp } from '@/components/kade/Stamp'
import { Pictogram } from '@/components/kade/Pictogram'
import { Road } from '@/components/kade/Road'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function LandingPage() {
  const t = useT()
  const [demoSent, setDemoSent] = useState(false)
  const [orders, setOrders] = useState(200)
  const [aov, setAov] = useState(3500)
  const [rtoNow, setRtoNow] = useState(20)
  const [rtoTarget, setRtoTarget] = useState(10)
  const [courierCost, setCourierCost] = useState(600)
  const [packingCost, setPackingCost] = useState(75)

  const lossNow = orders * (rtoNow / 100) * (courierCost + packingCost)
  const lossTarget = orders * (rtoTarget / 100) * (courierCost + packingCost)
  const saving = lossNow - lossTarget

  return (
    <div>
      <section className="border-b-2 border-ink bg-lagoon text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <p className="font-money text-4xl font-extrabold text-cash sm:text-5xl">
              {t('brand.name')}
            </p>
            <h1 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">
              {t('marketing.heroTitle')}
            </h1>
            <p className="mt-3 max-w-lg text-lg text-white/85">{t('marketing.heroBody')}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="cash" className="min-h-14 border-2 border-ink text-base font-extrabold">
                <Link to="/register">{t('common.startFree')}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-14 border-2 border-white bg-transparent text-base font-extrabold text-white hover:bg-white/10"
              >
                <Link to="/login">{t('marketing.tryDemo')}</Link>
              </Button>
              <SpeakButton text={t('marketing.heroTitle')} className="border-white text-white" />
            </div>
            <p className="mt-4 text-sm text-white/70">{t('marketing.freeNote')}</p>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-surface p-4 text-ink shadow-[var(--shadow-float)]">
            <p className="font-extrabold text-muted">{t('marketing.previewTitle')}</p>
            <div className="mt-3 space-y-2 rounded-xl border-2 border-ink bg-paper p-3">
              <div className="flex gap-2">
                <Pictogram id="chat" className="h-8 w-8" />
                <p className="text-base font-extrabold leading-snug">
                  akka saree red 2, Kandy, 0771234567
                </p>
              </div>
              <Button
                variant="cash"
                className="min-h-12 w-full border-2 border-ink font-extrabold"
                onClick={() => setDemoSent(true)}
              >
                {t('common.send')}
              </Button>
            </div>
            <div className="parcel-tag relative mt-4 p-4">
              <p className="font-money text-sm text-muted">LL-DEMO</p>
              <p className="text-xl font-extrabold">Kumari · Kandy</p>
              <p className="font-money text-2xl">Rs. 7,350</p>
              <div className="absolute right-3 top-4">
                <Stamp label={t('stamp.confirmed')} kind="confirmed" show={demoSent} />
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2 text-center text-xs font-extrabold">
              <div>
                <Pictogram id="chat" className="mx-auto h-10 w-10" />
                Chat
              </div>
              <div>
                <Pictogram id="parcel" className="mx-auto h-10 w-10" />
                Parcel
              </div>
              <div>
                <Pictogram id="bike" className="mx-auto h-10 w-10" />
                Bike
              </div>
              <div>
                <Pictogram id="coin" className="mx-auto h-10 w-10" />
                Money
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-3xl font-extrabold text-ink">{t('marketing.how')}</h2>
        <p className="mt-2 max-w-xl text-lg text-muted">
          Chat → parcel tag → bike → money. One yellow button at a time.
        </p>
        <div className="mt-6">
          <Road current="bike" t={t} />
        </div>
      </section>

      <section id="who" className="border-y-2 border-ink bg-paper py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-3xl font-extrabold">{t('marketing.who')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                pic: 'chat' as const,
                title: 'Home sellers',
                body: 'WhatsApp + Facebook. Pack on the table. Phone is the office.',
              },
              {
                pic: 'parcel' as const,
                title: 'Makers',
                body: 'Clothes, food, crafts. See what left the bag and what came back.',
              },
              {
                pic: 'purse' as const,
                title: 'Busy live sellers',
                body: 'One thumb. Big buttons. Hear labels out loud.',
              },
            ].map((row) => (
              <div key={row.title} className="rounded-xl border-2 border-ink bg-surface p-5">
                <Pictogram id={row.pic} className="h-14 w-14" />
                <h3 className="mt-3 text-xl font-extrabold">{row.title}</h3>
                <p className="mt-2 text-base text-muted">{row.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rto" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-3xl font-extrabold">{t('marketing.rto')}</h2>
        <p className="mt-2 text-lg text-muted">See what came-back parcels cost you in rupees.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border-2 border-ink bg-surface p-5">
            {(
              [
                ['Orders each month', orders, setOrders, 50, 800],
                ['Average order value', aov, setAov, 1000, 15000],
                ['Your RTO % now', rtoNow, setRtoNow, 5, 40],
                ['Target RTO %', rtoTarget, setRtoTarget, 3, 25],
                ['Courier cost', courierCost, setCourierCost, 200, 1500],
                ['Packing cost', packingCost, setPackingCost, 20, 300],
              ] as const
            ).map(([label, value, set, min, max]) => (
              <div key={label}>
                <Label className="text-base font-extrabold">
                  {label}: {label.includes('%') ? value : formatLkr(value)}
                </Label>
                <Input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-ink bg-risk/15 p-5">
              <p className="font-extrabold text-risk">Losing now</p>
              <p className="font-money text-4xl text-risk">{formatLkr(lossNow)}</p>
            </div>
            <div className="rounded-xl border-2 border-ink bg-ok/15 p-5">
              <p className="font-extrabold text-ok">If you hit target</p>
              <p className="font-money text-4xl text-ok">{formatLkr(lossTarget)}</p>
            </div>
            <div className="rounded-xl border-2 border-ink bg-cash/25 p-5">
              <p className="font-extrabold">You could keep</p>
              <p className="font-money text-4xl">{formatLkr(saving)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-ink bg-lagoon px-4 py-16 text-white md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold">{t('marketing.finalTitle')}</h2>
          <p className="mt-3 text-lg text-white/80">{t('marketing.finalBody')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="cash" className="min-h-14 border-2 border-ink font-extrabold">
              <Link to="/register">{t('marketing.createFree')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-14 border-2 border-white bg-transparent font-extrabold text-white hover:bg-white/10"
            >
              <Link to="/login">{t('marketing.tryDemo')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
