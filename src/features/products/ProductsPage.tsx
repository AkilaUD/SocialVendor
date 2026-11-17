import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { BigButton } from '@/components/kade/BigButton'
import { ProductSwatch } from '@/components/common/ProductSwatch'
import { Stamp } from '@/components/kade/Stamp'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function ProductsPage() {
  const t = useT()
  const products = useAppStore((s) => s.products)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{t('nav.products')}</h1>

      <BigButton
        tone="primary"
        icon={<Camera className="h-7 w-7" />}
        speakText={t('products.title')}
        onClick={() => toast.message('Camera — mock. Backend ask: product photo capture.')}
      >
        {t('products.title')}
      </BigButton>

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => {
          const available = p.variants.reduce((s, v) => s + (v.stockOnHand - v.stockReserved), 0)
          const from = Math.min(...p.variants.map((v) => v.price))
          const soldOut = available <= 0
          return (
            <div key={p.id} className="relative overflow-hidden rounded-xl border-2 border-ink bg-surface">
              <ProductSwatch title={p.category} hue={p.imageHue} className="h-32" />
              <div className="absolute right-2 top-2 rounded-md border-2 border-ink bg-cash px-2 py-1 font-money text-sm text-ink">
                {formatLkr(from)}
              </div>
              {soldOut ? (
                <div className="absolute left-2 top-2">
                  <Stamp label={t('kade.stampBack')} kind="returned" show />
                </div>
              ) : null}
              <div className="p-3">
                <p className="line-clamp-2 text-base font-extrabold leading-snug">{p.title}</p>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: Math.min(5, Math.max(0, available)) }).map((_, i) => (
                    <span key={i} className="h-3 w-3 rounded-sm border border-ink bg-ok" />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
