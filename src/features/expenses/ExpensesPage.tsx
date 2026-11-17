import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { StatTile } from '@/components/common/StatTile'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useT } from '@/i18n'
import type { Expense } from '@/types'
import { Receipt, TrendingUp } from 'lucide-react'
import { formatLkr } from '@/lib/utils'

export function ExpensesPage() {
  const t = useT()
  const expenses = useAppStore((s) => s.expenses)
  const orders = useAppStore((s) => s.orders)
  const addExpense = useAppStore((s) => s.addExpense)
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      category: 'ads' as Expense['category'],
      amount: 1000,
      note: '',
      date: new Date().toISOString().slice(0, 10),
    },
  })

  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0)
  const contribution = useMemo(
    () =>
      orders
        .filter((o) => ['delivered', 'paid'].includes(o.status))
        .map((o) => {
          const cogs = o.lines.reduce((s, l) => s + l.cost * l.qty, 0)
          const profit = o.subtotal - cogs - o.deliveryFee
          return { ...o, cogs, profit }
        }),
    [orders],
  )
  const profitSum = contribution.reduce((s, o) => s + o.profit, 0)

  return (
    <div>
      <PageHeader
        eyebrow={t('expenses.eyebrow')}
        title={t('expenses.title')}
        description={t('expenses.description')}
        actions={
          <Button variant="cash" className="min-h-11" onClick={() => setOpen(true)}>
            {t('expenses.add')}
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <StatTile label="Expenses (period)" value={formatLkr(expenseTotal)} icon={Receipt} />
        <StatTile label="Contribution (delivered)" value={formatLkr(profitSum)} icon={TrendingUp} tone="ok" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <h2 className="font-display text-lg font-bold">Expense log</h2>
          <div className="mt-3 space-y-2">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize">{e.category}</p>
                  <p className="text-xs text-muted">
                    {e.note} · {e.date}
                    {e.hasReceipt ? ' · receipt' : ''}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatLkr(e.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-desk)]">
          <h2 className="font-display text-lg font-bold">Profit per order</h2>
          <div className="mt-3 space-y-2">
            {contribution.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg bg-paper px-3 py-3">
                <div>
                  <p className="text-sm font-semibold">{o.number}</p>
                  <p className="text-xs text-muted">COGS {formatLkr(o.cogs)} · delivery {formatLkr(o.deliveryFee)}</p>
                </div>
                <p className={`text-sm font-bold ${o.profit >= 0 ? 'text-ok' : 'text-risk'}`}>
                  {formatLkr(o.profit)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={handleSubmit((values) => {
              addExpense({
                id: `e-${Date.now()}`,
                category: values.category,
                amount: Number(values.amount),
                note: values.note || 'Manual expense',
                date: values.date,
                hasReceipt: true,
              })
              toast.success('Expense logged')
              reset()
              setOpen(false)
            })}
          >
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={watch('category')}
                onValueChange={(v) => setValue('category', v as Expense['category'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['ads', 'packing', 'courier', 'materials', 'rent', 'salary', 'other'] as const).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (LKR)</Label>
              <Input type="number" {...register('amount', { valueAsNumber: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Note</Label>
              <Input {...register('note')} />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" {...register('date')} />
            </div>
            <Button type="submit" variant="lagoon" className="w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
