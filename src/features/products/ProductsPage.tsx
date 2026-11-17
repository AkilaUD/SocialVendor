import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ProductSwatch } from '@/components/common/ProductSwatch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function ProductsPage() {
  const t = useT()
  const products = useAppStore((s) => s.products)

  return (
    <div>
      <PageHeader
        eyebrow={t('products.eyebrow')}
        title={t('products.title')}
        description={t('products.description')}
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/app/inventory">{t('products.openStock')}</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => {
          const available = p.variants.reduce((s, v) => s + (v.stockOnHand - v.stockReserved), 0)
          const low = p.variants.some((v) => v.stockOnHand - v.stockReserved <= v.reorderPoint)
          const from = Math.min(...p.variants.map((v) => v.price))
          return (
            <div key={p.id} className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
              <ProductSwatch title={p.category} hue={p.imageHue} className="h-36" />
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {p.isBook ? <Badge variant="lagoon">{t('products.book')}</Badge> : null}
                  {p.isMadeToOrder ? <Badge variant="cash">{t('products.madeToOrder')}</Badge> : null}
                  {low ? <Badge variant="risk">{t('products.lowStock')}</Badge> : null}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted">{t('products.from')}</p>
                    <p className="font-semibold">{formatLkr(from)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{t('products.available')}</p>
                    <p className="font-semibold">{available} {t('products.units')}</p>
                  </div>
                </div>
                {p.isBook && p.variants[0]?.isbn ? (
                  <p className="mt-3 text-xs text-muted">ISBN {p.variants[0].isbn} · {p.variants[0].author}</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
