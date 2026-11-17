import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareText, Volume2 } from 'lucide-react'
import { Stamp } from '@/components/kade/Stamp'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { useT } from '@/i18n'
import { speak } from '@/lib/speak'
import { useLocaleStore } from '@/stores/useLocaleStore'

export function LandingPage() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const [sent, setSent] = useState(false)

  return (
    <div className="bg-paper">
      <section className="ink-wash px-4 py-10 text-white md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-3xl font-extrabold text-cash sm:text-4xl">
            {t('brand.name')}
          </p>
          <p className="mt-3 max-w-xl text-lg font-bold text-white/90">{t('kade.chatDemo')}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-4 border-ink bg-surface p-4 text-ink">
              <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-muted">
                <MessageSquareText className="h-5 w-5" /> WhatsApp
              </p>
              <div className="space-y-2">
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-paper-2 px-3 py-2 text-base font-bold leading-snug">
                  akka saree red 2, Kandy, 0771234567
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ok text-lg font-extrabold text-white active:translate-y-px"
                onClick={() => setSent(true)}
              >
                Send
              </button>
            </div>

            <div className="parcel-tag relative min-h-48 p-5 text-ink">
              <div className="absolute right-4 top-3 h-3 w-3 rounded-full border-2 border-ink bg-paper" />
              {sent ? (
                <>
                  <p className="font-money text-sm text-muted">LL-NEW</p>
                  <p className="mt-2 text-2xl font-extrabold">Kumari</p>
                  <p className="text-base">077 123 4567</p>
                  <p className="mt-1 text-muted">Kandy · red saree ×2</p>
                  <p className="mt-3 font-money text-3xl">Rs. 7,000</p>
                  <div className="absolute bottom-4 right-4">
                    <Stamp label={t('kade.stampReady')} kind="ready" show />
                  </div>
                </>
              ) : (
                <p className="mt-10 text-center text-lg font-extrabold text-muted">
                  {t('kade.chatDemo')}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-16 flex-1 items-center justify-center gap-3 rounded-xl border-4 border-ink bg-cash px-4 text-xl font-extrabold text-ink"
            >
              {t('kade.startWhatsapp')}
            </a>
            <SpeakButton
              text={t('kade.startWhatsapp')}
              label={t('kade.hearIt')}
              className="border-4 border-white bg-white/10 text-white"
            />
          </div>
          <p className="mt-4 text-sm font-bold text-white/70">{t('marketing.freeNote')}</p>
          <Link
            to="/login"
            className="mt-3 inline-flex min-h-12 items-center gap-2 text-base font-extrabold text-cash"
          >
            {t('marketing.tryDemo')}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="rounded-2xl border-2 border-ink bg-surface p-5">
          <p className="text-lg font-extrabold">
            REPLACE WITH REAL SELLERS — photo + 15s video
          </p>
          <p className="mt-2 text-muted">from chat to parcel in 2 taps</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-base font-extrabold">
          <span className="rounded-lg bg-cash px-3 py-2 text-ink">Chat</span>
          <span>→</span>
          <span className="rounded-lg border-2 border-ink px-3 py-2">Parcel</span>
          <span>→</span>
          <span className="rounded-lg border-2 border-ink px-3 py-2">Bike</span>
          <span>→</span>
          <span className="rounded-lg bg-ok px-3 py-2 text-white">Money</span>
        </div>

        <div className="rounded-2xl border-2 border-ink bg-surface p-5">
          <p className="font-extrabold">{t('marketing.pricing')}</p>
          <p className="mt-2 font-money text-3xl">Rs. 0</p>
          <p className="mt-1 text-muted">{t('marketing.freeNote')}</p>
          <Link
            to="/pricing"
            className="mt-4 inline-flex min-h-12 items-center font-extrabold text-lagoon"
          >
            {t('marketing.pricing')}
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-surface font-extrabold"
          onClick={() => speak(t('marketing.heroBody'), locale)}
        >
          <Volume2 className="h-5 w-5" /> {t('kade.hearIt')}
        </button>
      </section>
    </div>
  )
}
