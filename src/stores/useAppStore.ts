import { create } from 'zustand'
import {
  bankPayments as seedBankPayments,
  customers as seedCustomers,
  expenses as seedExpenses,
  invoices as seedInvoices,
  notifications as seedNotifications,
  orders as seedOrders,
  products as seedProducts,
  remittances as seedRemittances,
  returns as seedReturns,
  shipments as seedShipments,
  team as seedTeam,
  tickets as seedTickets,
  tenant as seedTenant,
} from '@/data/mock'
import type {
  BankPayment,
  BankPaymentStatus,
  Customer,
  Expense,
  Invoice,
  NotificationItem,
  Order,
  OrderStatus,
  Product,
  RemittanceLine,
  ReturnRecord,
  Shipment,
  TeamMember,
  TenantProfile,
  Ticket,
} from '@/types'

function applyPaymentToOrder(order: Order, payment: BankPayment): Order {
  const dueBefore = Math.max(
    0,
    order.subtotal + order.deliveryFee - order.discount - order.advancePaid,
  )
  const applied = Math.min(payment.amount, dueBefore)
  const nextAdvance = order.advancePaid + applied
  const nextCod = Math.max(0, order.subtotal + order.deliveryFee - order.discount - nextAdvance)
  const tags = order.tags.filter((t) => t !== 'advance-due' && t !== 'slip-pending')

  let status = order.status
  if (payment.status === 'verified' && order.status === 'on_hold' && applied > 0) {
    status = 'confirmed'
  }
  if (payment.status === 'verified' && nextCod === 0 && status === 'delivered') {
    status = 'paid'
  }

  return {
    ...order,
    status,
    advancePaid: nextAdvance,
    codAmount: nextCod,
    tags,
    confirmedAt:
      status === 'confirmed' && !order.confirmedAt ? new Date().toISOString() : order.confirmedAt,
  }
}

interface AppState {
  authenticated: boolean
  onboardingDone: boolean
  tenant: TenantProfile
  orders: Order[]
  customers: Customer[]
  products: Product[]
  shipments: Shipment[]
  remittances: RemittanceLine[]
  bankPayments: BankPayment[]
  returns: ReturnRecord[]
  expenses: Expense[]
  tickets: Ticket[]
  invoices: Invoice[]
  team: TeamMember[]
  notifications: NotificationItem[]
  sidebarCollapsed: boolean
  login: () => void
  logout: () => void
  completeOnboarding: () => void
  setSidebarCollapsed: (v: boolean) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: OrderStatus, patch?: Partial<Order>) => void
  addCustomer: (customer: Customer) => void
  addExpense: (expense: Expense) => void
  matchRemittance: (id: string, orderId: string) => void
  addBankPayment: (payment: BankPayment, opts?: { applyNow?: boolean }) => void
  setBankPaymentStatus: (id: string, status: BankPaymentStatus) => void
  updateTicketStatus: (id: string, status: Ticket['status']) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateReturn: (id: string, patch: Partial<ReturnRecord>) => void
  updateTenant: (patch: Partial<TenantProfile>) => void
}

export const useAppStore = create<AppState>((set) => ({
  authenticated: false,
  onboardingDone: false,
  tenant: seedTenant,
  orders: seedOrders,
  customers: seedCustomers,
  products: seedProducts,
  shipments: seedShipments,
  remittances: seedRemittances,
  bankPayments: seedBankPayments,
  returns: seedReturns,
  expenses: seedExpenses,
  tickets: seedTickets,
  invoices: seedInvoices,
  team: seedTeam,
  notifications: seedNotifications,
  sidebarCollapsed: false,

  login: () => set({ authenticated: true }),
  logout: () => set({ authenticated: false }),
  completeOnboarding: () => set({ onboardingDone: true }),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  addOrder: (order) =>
    set((s) => ({
      orders: [order, ...s.orders],
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: 'Order captured',
          body: `${order.number} from ${order.customerName}`,
          type: 'order',
          read: false,
          createdAt: new Date().toISOString(),
          href: `/app/orders/${order.id}`,
        },
        ...s.notifications,
      ],
    })),

  updateOrderStatus: (id, status, patch) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, status, ...patch } : o)),
    })),

  addCustomer: (customer) => set((s) => ({ customers: [customer, ...s.customers] })),

  addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),

  matchRemittance: (id, orderId) =>
    set((s) => ({
      remittances: s.remittances.map((r) =>
        r.id === id ? { ...r, matched: true, orderId } : r,
      ),
    })),

  addBankPayment: (payment, opts) =>
    set((s) => {
      const applyNow = opts?.applyNow ?? payment.status === 'verified'
      const working = applyNow ? { ...payment, status: 'verified' as const, verifiedAt: new Date().toISOString() } : payment
      return {
        bankPayments: [working, ...s.bankPayments],
        orders: applyNow
          ? s.orders.map((o) => (o.id === working.orderId ? applyPaymentToOrder(o, working) : o))
          : s.orders.map((o) =>
              o.id === working.orderId
                ? {
                    ...o,
                    tags: o.tags.includes('slip-pending') ? o.tags : [...o.tags, 'slip-pending'],
                  }
                : o,
            ),
        notifications: [
          {
            id: `n-bp-${Date.now()}`,
            title: working.status === 'verified' ? 'Bank deposit verified' : 'Bank slip submitted',
            body: `${working.orderNumber} · LKR ${working.amount.toLocaleString('en-LK')} (${working.purpose})`,
            type: 'money',
            read: false,
            createdAt: new Date().toISOString(),
            href: '/app/payments',
          },
          ...s.notifications,
        ],
      }
    }),

  setBankPaymentStatus: (id, status) =>
    set((s) => {
      const payment = s.bankPayments.find((p) => p.id === id)
      if (!payment) return s
      const nextPayment: BankPayment = {
        ...payment,
        status,
        verifiedAt: status === 'verified' ? new Date().toISOString() : payment.verifiedAt,
      }
      return {
        bankPayments: s.bankPayments.map((p) => (p.id === id ? nextPayment : p)),
        orders:
          status === 'verified'
            ? s.orders.map((o) =>
                o.id === nextPayment.orderId
                  ? {
                      ...applyPaymentToOrder(o, nextPayment),
                      tags: applyPaymentToOrder(o, nextPayment).tags.filter((t) => t !== 'slip-pending'),
                    }
                  : o,
              )
            : s.orders.map((o) =>
                o.id === nextPayment.orderId
                  ? { ...o, tags: o.tags.filter((t) => t !== 'slip-pending') }
                  : o,
              ),
      }
    }),

  updateTicketStatus: (id, status) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
      ),
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  updateReturn: (id, patch) =>
    set((s) => ({
      returns: s.returns.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  updateTenant: (patch) => set((s) => ({ tenant: { ...s.tenant, ...patch } })),
}))
