import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BigButton } from '@/components/kade/BigButton'
import { Pictogram } from '@/components/kade/Pictogram'
import { PageHeader } from '@/components/common/PageHeader'
import { RiskBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { districts } from '@/data/mock'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { Order } from '@/types'
import { formatLkr } from '@/lib/utils'

function parseChat(text: string) {
  const phoneMatch = text.match(/(?:0|\+94)7\d{8}/)
  const phone = phoneMatch?.[0]?.replace('+94', '0') ?? ''
  const lines = text.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
  const name =
    lines.find((l) => !/(?:0|\+94)7\d{8}/.test(l) && !/\d{2,}/.test(l) && l.length > 2) ?? ''
  const addressLine =
    lines.find((l) =>
      /road|rd|street|lane|nugegoda|colombo|kandy|galle|negombo|dehiwala|bambalapitiya/i.test(l),
    ) ?? ''
  return { name, phone, addressLine }
}

export function QuickOrderPage() {
  const t = useT()
  const products = useAppStore((s) => s.products)
  const customers = useAppStore((s) => s.customers)
  const addOrder = useAppStore((s) => s.addOrder)
  const navigate = useNavigate()

  const [paste, setPaste] = useState('Dilani 0765544332\nNo.5 Lake Rd Nugegoda\nM teal dress please')
  const [name, setName] = useState('Dilani Wijesinghe')
  const [phone, setPhone] = useState('0765544332')
  const [address, setAddress] = useState('No. 5, Lake Road')
  const [city, setCity] = useState('Nugegoda')
  const [district, setDistrict] = useState('Colombo')
  const [variantId, setVariantId] = useState('v2')
  const [qty, setQty] = useState(1)
  const [deliveryFee, setDeliveryFee] = useState(350)

  const variants = useMemo(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => ({
          ...v,
          productTitle: p.title,
          productId: p.id,
        })),
      ),
    [products],
  )

  const selected = variants.find((v) => v.id === variantId)
  const known = customers.find((c) => c.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''))
  const subtotal = (selected?.price ?? 0) * qty
  const codAmount = subtotal + deliveryFee

  const applyPaste = () => {
    const parsed = parseChat(paste)
    if (parsed.name) setName(parsed.name)
    if (parsed.phone) setPhone(parsed.phone)
    if (parsed.addressLine) {
      setAddress(parsed.addressLine)
      if (/nugegoda/i.test(parsed.addressLine)) {
        setCity('Nugegoda')
        setDistrict('Colombo')
      }
    }
    toast.success(t('quickOrder.parsed'))
  }

  const submit = () => {
    if (!selected || !name || !phone) {
      toast.error('Name, phone and product are required')
      return
    }
    const id = `o-${Date.now()}`
    const order: Order = {
      id,
      number: `LL-${10483 + Math.floor(Math.random() * 50)}`,
      status: known?.riskLevel === 'high' ? 'on_hold' : 'new',
      channel: 'whatsapp',
      customerId: known?.id ?? `c-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      address: { line1: address, city, district },
      lines: [
        {
          id: `ol-${Date.now()}`,
          variantId: selected.id,
          productTitle: selected.productTitle,
          variantName: selected.name,
          sku: selected.sku,
          qty,
          unitPrice: selected.price,
          cost: selected.cost,
        },
      ],
      subtotal,
      deliveryFee,
      discount: 0,
      codAmount: known?.riskLevel === 'high' ? Math.max(0, codAmount - 2000) : codAmount,
      advancePaid: known?.riskLevel === 'high' ? 2000 : 0,
      notes: paste,
      tags: known?.riskLevel === 'high' ? ['advance-due'] : [],
      createdAt: new Date().toISOString(),
      riskLevel: known?.riskLevel ?? 'medium',
    }
    addOrder(order)
    toast.success(t('quickOrder.created', { number: order.number }), {
      description: order.status === 'on_hold' ? t('quickOrder.nextHold') : t('quickOrder.nextOk'),
    })
    navigate(`/app/orders/${id}`)
  }

  return (
    <div>
      <PageHeader
        eyebrow={t('quickOrder.eyebrow')}
        title={t('quickOrder.title')}
        description={t('quickOrder.description')}
        tip={t('quickOrder.tip')}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div className="space-y-1.5">
            <Label>{t('quickOrder.paste')}</Label>
            <Textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} />
          </div>
          <Button variant="soft" className="min-h-11" onClick={applyPaste}>
            {t('quickOrder.parse')}
          </Button>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t('quickOrder.name')}</Label>
              <Input className="min-h-11" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('quickOrder.phone')}</Label>
              <Input className="min-h-11" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('quickOrder.district')}</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t('quickOrder.address')}</Label>
              <Input className="min-h-11" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('quickOrder.city')}</Label>
              <Input className="min-h-11" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('quickOrder.deliveryFee')}</Label>
              <Input
                className="min-h-11"
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div className="space-y-1.5">
            <Label>{t('quickOrder.variant')}</Label>
            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.productTitle} — {v.name} ({formatLkr(v.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t('quickOrder.qty')}</Label>
            <Input
              className="min-h-11"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />
          </div>

          <div className="rounded-lg bg-paper p-4">
            <p className="text-xs font-semibold uppercase text-muted">{t('quickOrder.risk')}</p>
            {known ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{known.name}</p>
                  <p className="text-xs text-muted">
                    {known.orderCount} orders · {known.rtoCount} RTO · LTV {formatLkr(known.lifetimeValue)}
                  </p>
                </div>
                <RiskBadge level={known.riskLevel} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">{t('quickOrder.newPhone')}</p>
            )}
          </div>

          <div className="rounded-lg border border-line p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('quickOrder.subtotal')}</span>
              <span className="font-semibold">{formatLkr(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-muted">{t('quickOrder.codAmount')}</span>
              <span className="font-display text-xl font-bold">{formatLkr(codAmount)}</span>
            </div>
          </div>

          <BigButton
            tone="primary"
            icon={<Pictogram id="stamp" />}
            speakText={t('quickOrder.create')}
            onClick={submit}
          >
            {t('quickOrder.create')}
          </BigButton>
        </div>
      </div>
    </div>
  )
}
