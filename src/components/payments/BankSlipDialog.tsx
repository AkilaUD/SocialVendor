import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { BankPaymentPurpose, Order } from '@/types'
import { formatLkr } from '@/lib/utils'

const purposeIds: BankPaymentPurpose[] = ['delivery', 'advance', 'partial', 'full', 'other']

export function BankSlipDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useT()
  const tenant = useAppStore((s) => s.tenant)
  const addBankPayment = useAppStore((s) => s.addBankPayment)

  const suggested = useMemo(() => {
    if (order.status === 'on_hold') return Math.max(order.deliveryFee, Math.min(2000, order.codAmount))
    return order.deliveryFee || order.codAmount
  }, [order])

  const [purpose, setPurpose] = useState<BankPaymentPurpose>(
    order.status === 'on_hold' ? 'advance' : 'delivery',
  )
  const [amount, setAmount] = useState(suggested)
  const [reference, setReference] = useState('')
  const [depositedAt, setDepositedAt] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [slipName, setSlipName] = useState<string>()
  const [slipDataUrl, setSlipDataUrl] = useState<string>()
  const [verifyNow, setVerifyNow] = useState(true)

  const onFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Upload a photo or PDF of the bank slip')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setSlipName(file.name)
      setSlipDataUrl(typeof reader.result === 'string' ? reader.result : undefined)
    }
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!amount || amount <= 0) {
      toast.error('Enter the deposited amount')
      return
    }
    if (!slipName) {
      toast.error('Attach the bank slip photo')
      return
    }

    addBankPayment(
      {
        id: `bp-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.number,
        customerName: order.customerName,
        amount,
        purpose,
        status: verifyNow ? 'verified' : 'pending',
        reference: reference || undefined,
        depositedAt,
        createdAt: new Date().toISOString(),
        slipName,
        slipDataUrl,
        note: note || undefined,
        verifiedAt: verifyNow ? new Date().toISOString() : undefined,
      },
      { applyNow: verifyNow },
    )

    toast.success(verifyNow ? 'Bank deposit recorded & applied' : 'Bank slip saved — pending verify', {
      description: `${formatLkr(amount)} · ${t(`pay.${purpose}`)} · ${order.number}`,
    })
    onOpenChange(false)
  }

  const bank = tenant.bankAccount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('bankSlip.title')}</DialogTitle>
          <DialogDescription>{t('bankSlip.description')}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-line bg-paper p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t('bankSlip.depositTo')}
          </p>
          <p className="mt-1 font-semibold text-ink">
            {bank.bankName} · {bank.accountName}
          </p>
          <p className="text-muted">
            A/C {bank.accountNumber} · {bank.branch}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t('bankSlip.whatPaid')}</Label>
            <Select
              value={purpose}
              onValueChange={(v) => {
                const next = v as BankPaymentPurpose
                setPurpose(next)
                if (next === 'delivery') setAmount(order.deliveryFee)
                if (next === 'full')
                  setAmount(order.codAmount || order.subtotal + order.deliveryFee - order.discount)
                if (next === 'advance' && order.status === 'on_hold') setAmount(suggested)
              }}
            >
              <SelectTrigger className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {purposeIds.map((pid) => (
                  <SelectItem key={pid} value={pid}>
                    {t(`pay.${pid}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t('bankSlip.amount')}</Label>
              <Input
                className="min-h-11"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('bankSlip.date')}</Label>
              <Input
                className="min-h-11"
                type="date"
                value={depositedAt}
                onChange={(e) => setDepositedAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('bankSlip.reference')}</Label>
            <Input
              className="min-h-11"
              placeholder="e.g. FT2611158891"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('bankSlip.slipPhoto')}</Label>
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center hover:border-lagoon/50">
              <Upload className="h-5 w-5 text-lagoon" />
              <span className="text-sm font-medium">
                {slipName ? slipName : t('bankSlip.upload')}
              </span>
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
                alt="Bank slip preview"
                className="mt-2 max-h-40 w-full rounded-lg border border-line bg-surface object-contain"
              />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label>{t('bankSlip.note')}</Label>
            <Textarea
              rows={2}
              placeholder="e.g. Paid delivery so rider collects goods only"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={verifyNow}
              onChange={(e) => setVerifyNow(e.target.checked)}
            />
            <span>
              <strong>{t('bankSlip.applyNow')}</strong>
              <span className="block text-xs text-muted">{t('bankSlip.applyHint')}</span>
            </span>
          </label>

          <Button className="w-full min-h-12" variant="lagoon" onClick={submit}>
            {t('bankSlip.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
