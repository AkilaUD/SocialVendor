import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function InventoryPage() {
  const t = useT()
  const products = useAppStore((s) => s.products)
  const [open, setOpen] = useState(false)
  const [sku, setSku] = useState('')
  const [delta, setDelta] = useState(0)

  const rows = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productTitle: p.title,
      available: v.stockOnHand - v.stockReserved,
      low: v.stockOnHand - v.stockReserved <= v.reorderPoint,
    })),
  )

  return (
    <div>
      <PageHeader
        eyebrow={t('inventory.eyebrow')}
        title={t('inventory.title')}
        description={t('inventory.description')}
      />

      <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-desk)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">On hand</th>
              <th className="px-4 py-3 font-semibold">Reserved</th>
              <th className="px-4 py-3 font-semibold">Available</th>
              <th className="px-4 py-3 font-semibold">Cost</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line/70">
                <td className="px-4 py-3 font-medium">{r.sku}</td>
                <td className="px-4 py-3">
                  {r.productTitle}
                  <span className="block text-xs text-muted">{r.name}</span>
                </td>
                <td className="px-4 py-3">{r.stockOnHand}</td>
                <td className="px-4 py-3">{r.stockReserved}</td>
                <td className={`px-4 py-3 font-semibold ${r.low ? 'text-risk' : ''}`}>{r.available}</td>
                <td className="px-4 py-3">{formatLkr(r.cost)}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSku(r.sku)
                      setDelta(0)
                      setOpen(true)
                    }}
                  >
                    Adjust
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock adjustment</DialogTitle>
            <DialogDescription>Demo only — changes are not persisted to variant counts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input value={sku} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Delta (+/−)</Label>
              <Input type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value) || 0)} />
            </div>
            <Button
              variant="lagoon"
              onClick={() => {
                toast.success(`Logged adjustment ${delta >= 0 ? '+' : ''}${delta} for ${sku}`)
                setOpen(false)
              }}
            >
              Save adjustment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
