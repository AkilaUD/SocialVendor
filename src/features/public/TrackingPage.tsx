import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Building2, Package, Truck, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { orders, shipments, tenant } from '@/data/mock'
import { useAppStore } from '@/stores/useAppStore'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useT } from '@/i18n'
import { formatLkr } from '@/lib/utils'

export function TrackingPage() {
  const t = useT()
  const { waybill } = useParams()
  const addBankPayment = useAppStore((s) => s.addBankPayment)
  const liveTenant = useAppStore((s) => s.tenant)
  const bank = liveTenant.bankAccount ?? tenant.bankAccount

  const shipment = shipments.find((s) => s.waybill === waybill) ?? {
    waybill: waybill ?? 'UNKNOWN',
    orderId: 'o5',
    orderNumber: 'LL-XXXX',
    courier: 'Courier',
    status: 'in_transit' as const,
    codAmount: 0,
    district: 'Sri Lanka',
    updatedAt: new Date().toISOString(),
    attempts: 0,
  }

  const order = useMemo(
    () => orders.find((o) => o.id === shipment.orderId || o.waybill === waybill),
    [shipment.orderId, waybill],
  )

  const [amount, setAmount] = useState(order?.deliveryFee ?? (shipment.codAmount || 350))
  const [reference, setReference] = useState('')
  const [slipName, setSlipName] = useState<string>()
  const [slipDataUrl, setSlipDataUrl] = useState<string>()
  const [sent, setSent] = useState(false)

  const steps = ['label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'] as const
  const idx = Math.max(
    0,
    steps.findIndex((s) => s === shipment.status),
  )

  const onFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSlipName(file.name)
      setSlipDataUrl(typeof reader.result === 'string' ? reader.result : undefined)
    }
    reader.readAsDataURL(file)
  }

  const submitSlip = () => {
    if (!slipName || !amount) {
      toast.error('Amount and slip photo are required')
      return
    }
    addBankPayment({
      id: `bp-public-${Date.now()}`,
      orderId: order?.id ?? shipment.orderId ?? 'unknown',
      orderNumber: order?.number ?? shipment.orderNumber,
      customerName: order?.customerName ?? 'Customer',
      amount,
      purpose: amount <= (order?.deliveryFee ?? amount) ? 'delivery' : 'partial',
      status: 'pending',
      reference: reference || undefined,
      depositedAt: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      slipName,
      slipDataUrl,
      note: 'Submitted from tracking page',
    })
    setSent(true)
    toast.success(t('tracking.sent'))
  }

  return (
    <div className="min-h-screen paper-noise">
      <div className="ink-wash px-4 py-10 text-on-ink">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.16em] text-cash">
              {liveTenant.businessName || tenant.businessName}
            </p>
            <LanguageSwitcher compact className="shrink-0 border-white/20 bg-white/10" />
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {t('tracking.title')}
          </h1>
          <p className="mt-1 break-all text-on-ink/70">{shipment.waybill}</p>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-on-ink">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold capitalize">{shipment.status.replaceAll('_', ' ')}</p>
              <p className="text-sm text-muted">
                {shipment.courier} · {shipment.district}
              </p>
            </div>
          </div>

          <ol className="mt-6 space-y-3">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${i <= idx && shipment.status !== 'rto' ? 'bg-lagoon' : 'bg-stone'}`}
                />
                <span className={i <= idx ? 'font-medium text-ink' : 'text-muted'}>
                  {step.replaceAll('_', ' ')}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl bg-paper p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Package className="h-4 w-4 text-lagoon" /> Order {shipment.orderNumber}
            </p>
            {shipment.codAmount > 0 ? (
              <p className="mt-1 text-muted">
                {t('tracking.cod', { amount: formatLkr(shipment.codAmount) })}
              </p>
            ) : (
              <p className="mt-1 text-muted">{t('tracking.prepaid')}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-lagoon" />
            <h2 className="font-display text-lg font-bold">{t('tracking.payTitle')}</h2>
          </div>
          <p className="mt-2 text-sm text-muted">{t('tracking.payBody')}</p>
          <div className="mt-3 rounded-xl bg-paper p-3 text-sm">
            <p className="font-semibold">
              {bank.bankName} · {bank.accountName}
            </p>
            <p className="text-muted">
              A/C {bank.accountNumber} · {bank.branch}
            </p>
          </div>

          {sent ? (
            <p className="mt-4 rounded-lg bg-ok/10 px-3 py-3 text-sm text-ok">{t('tracking.sent')}</p>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label>{t('tracking.amount')}</Label>
                <Input
                  className="min-h-11"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('bankSlip.reference')}</Label>
                <Input
                  className="min-h-11"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transfer ref"
                />
              </div>
              <label className="flex min-h-24 cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-paper px-4 py-5 text-center">
                <Upload className="h-5 w-5 text-lagoon" />
                <span className="text-sm font-medium">{slipName ?? t('tracking.uploadSlip')}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
              {slipDataUrl?.startsWith('data:image') ? (
                <img
                  src={slipDataUrl}
                  alt="Slip preview"
                  className="max-h-40 w-full rounded-lg border border-line object-contain"
                />
              ) : null}
              <Button className="w-full min-h-12" variant="lagoon" onClick={submitSlip}>
                {t('tracking.submitSlip')}
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted">{liveTenant.returnPolicy || tenant.returnPolicy}</p>
        <Button asChild className="w-full min-h-11" variant="outline">
          <Link to="/">{t('common.poweredBy')}</Link>
        </Button>
      </div>
    </div>
  )
}
