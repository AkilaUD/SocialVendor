import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock3,
  Package,
  PauseCircle,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useT } from '@/i18n'
import type { OrderStatus, RiskLevel, TicketStatus } from '@/types'
import { cn } from '@/lib/utils'

const orderVariant: Record<
  OrderStatus,
  'lagoon' | 'cash' | 'ok' | 'risk' | 'muted' | 'default' | 'outline'
> = {
  new: 'cash',
  confirmed: 'lagoon',
  on_hold: 'risk',
  packed: 'default',
  dispatched: 'lagoon',
  delivered: 'ok',
  paid: 'ok',
  rto: 'risk',
  cancelled: 'muted',
  returned: 'outline',
}

const orderIcon: Record<OrderStatus, typeof CircleDot> = {
  new: CircleDot,
  confirmed: CheckCircle2,
  on_hold: PauseCircle,
  packed: Package,
  dispatched: Send,
  delivered: CheckCircle2,
  paid: CheckCircle2,
  rto: RotateCcw,
  cancelled: XCircle,
  returned: RotateCcw,
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const t = useT()
  const Icon = orderIcon[status]
  return (
    <Badge variant={orderVariant[status]} className="gap-1 whitespace-normal">
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      <span className="min-w-0">{t(`status.${status}`)}</span>
    </Badge>
  )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const t = useT()
  const map = {
    low: { variant: 'ok' as const, Icon: ShieldCheck },
    medium: { variant: 'cash' as const, Icon: AlertTriangle },
    high: { variant: 'risk' as const, Icon: ShieldAlert },
  }
  const item = map[level]
  return (
    <Badge variant={item.variant} className="gap-1">
      <item.Icon className="h-3 w-3" aria-hidden />
      {t(`status.${level}`)}
    </Badge>
  )
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const t = useT()
  const map: Record<
    TicketStatus,
    { variant: 'lagoon' | 'cash' | 'ok' | 'muted' | 'outline'; Icon: typeof Clock3 }
  > = {
    open: { variant: 'cash', Icon: CircleDot },
    in_progress: { variant: 'lagoon', Icon: Clock3 },
    waiting: { variant: 'outline', Icon: PauseCircle },
    resolved: { variant: 'ok', Icon: CheckCircle2 },
    closed: { variant: 'muted', Icon: XCircle },
  }
  const item = map[status]
  return (
    <Badge variant={item.variant} className="gap-1">
      <item.Icon className="h-3 w-3" aria-hidden />
      {t(`status.${status}`)}
    </Badge>
  )
}

export function ChannelPill({ channel }: { channel: string }) {
  return (
    <Badge variant="outline" className={cn('normal-case tracking-normal')}>
      {channel}
    </Badge>
  )
}
