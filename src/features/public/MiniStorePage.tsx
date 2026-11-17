import { Link, useParams } from 'react-router-dom'
import { ProductSwatch } from '@/components/common/ProductSwatch'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { products, tenant } from '@/data/mock'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function MiniStorePage() {
  const { slug } = useParams()
  const t = useT()

  return (
    <div className="min-h-screen bg-paper">
      <header className="ink-wash px-4 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex justify-end">
            <LanguageSwitcher compact className="border-white/20 bg-white/10" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cash">Mini-store</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">{tenant.businessName}</h1>
          <p className="mt-2 max-w-xl text-mint/75">
            Order via WhatsApp — catalog for {slug?.replace('-', ' ') ?? 'this seller'}.
          </p>
          <Button asChild className="mt-6 min-h-12" variant="cash">
            <a href={`https://wa.me/94${tenant.phone.slice(1)}`} target="_blank" rel="noreferrer">
              {t('store.chatOrder')}
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:grid-cols-2">
        {products
          .filter((p) => p.active)
          .map((p) => {
            const price = Math.min(...p.variants.map((v) => v.price))
            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]"
              >
                <ProductSwatch title={p.category} hue={p.imageHue} className="h-40" />
                <div className="p-4">
                  <h2 className="font-display text-xl font-bold">{p.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold">{t('store.from', { price: formatLkr(price) })}</p>
                    <Button size="sm" variant="lagoon" className="min-h-10" asChild>
                      <a
                        href={`https://wa.me/94${tenant.phone.slice(1)}?text=I want ${encodeURIComponent(p.title)}`}
                      >
                        {t('store.order')}
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
      </main>

      <footer className="border-t border-line px-4 py-8 text-center text-sm text-muted">
        <p>{tenant.returnPolicy}</p>
        <Link to="/" className="mt-3 inline-block font-semibold text-lagoon hover:underline">
          {t('common.poweredBy')}
        </Link>
      </footer>
    </div>
  )
}
