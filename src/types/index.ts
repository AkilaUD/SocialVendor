export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'on_hold'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'paid'
  | 'rto'
  | 'cancelled'
  | 'returned'

export type Channel = 'whatsapp' | 'facebook' | 'instagram' | 'tiktok' | 'phone' | 'daraz' | 'walk-in'

export type RiskLevel = 'low' | 'medium' | 'high'

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

export type UserRole = 'owner' | 'order_agent' | 'packer' | 'accountant' | 'maker' | 'readonly'

export interface Address {
  line1: string
  city: string
  district: string
  postalCode?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  altPhone?: string
  email?: string
  addresses: Address[]
  tags: string[]
  riskScore: number
  riskLevel: RiskLevel
  lifetimeValue: number
  orderCount: number
  rtoCount: number
  lastOrderAt: string
  notes?: string
  marketingOptIn: boolean
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  attributes: Record<string, string>
  cost: number
  price: number
  stockOnHand: number
  stockReserved: number
  reorderPoint: number
  barcode?: string
  isbn?: string
  author?: string
  condition?: 'new' | 'used' | 'like_new'
}

export interface Product {
  id: string
  title: string
  category: string
  description: string
  channelTags: Channel[]
  imageHue: number
  variants: ProductVariant[]
  active: boolean
  isBook?: boolean
  isMadeToOrder?: boolean
}

export interface OrderLine {
  id: string
  variantId: string
  productTitle: string
  variantName: string
  sku: string
  qty: number
  unitPrice: number
  cost: number
}

export interface Order {
  id: string
  number: string
  status: OrderStatus
  channel: Channel
  customerId: string
  customerName: string
  customerPhone: string
  address: Address
  lines: OrderLine[]
  subtotal: number
  deliveryFee: number
  discount: number
  codAmount: number
  advancePaid: number
  notes?: string
  tags: string[]
  createdAt: string
  confirmedAt?: string
  packedAt?: string
  dispatchedAt?: string
  deliveredAt?: string
  waybill?: string
  courier?: string
  riskLevel: RiskLevel
  invoiceNumber?: string
}

export interface Shipment {
  id: string
  orderId: string
  orderNumber: string
  waybill: string
  courier: string
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'rto'
  codAmount: number
  fee: number
  district: string
  createdAt: string
  updatedAt: string
  attempts: number
}

export interface RemittanceLine {
  id: string
  statementRef: string
  waybill: string
  amount: number
  fee: number
  courier: string
  matched: boolean
  orderId?: string
  remittedAt: string
}

export interface ReturnRecord {
  id: string
  orderId: string
  orderNumber: string
  type: 'rto' | 'customer'
  reason: string
  grade: 'A' | 'B' | 'C' | null
  status: 'pending' | 'received' | 'inspected' | 'restocked' | 'written_off' | 'refunded'
  waybill?: string
  createdAt: string
  refundAmount?: number
}

export interface Expense {
  id: string
  category: 'ads' | 'packing' | 'courier' | 'materials' | 'rent' | 'salary' | 'other'
  amount: number
  note: string
  channel?: Channel
  date: string
  hasReceipt: boolean
}

export interface Ticket {
  id: string
  subject: string
  orderId?: string
  orderNumber?: string
  customerId: string
  customerName: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  owner: string
  rootCause?: string
  createdAt: string
  updatedAt: string
  slaHours: number
}

export interface Invoice {
  id: string
  number: string
  orderId: string
  orderNumber: string
  customerName: string
  total: number
  status: 'draft' | 'sent' | 'paid' | 'void'
  issuedAt: string
  vatEnabled: boolean
}

export interface TeamMember {
  id: string
  name: string
  phone: string
  role: UserRole
  active: boolean
  lastActiveAt: string
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  type: 'order' | 'dispatch' | 'money' | 'care' | 'system'
  read: boolean
  createdAt: string
  href?: string
}

export type BankPaymentPurpose = 'delivery' | 'advance' | 'full' | 'partial' | 'other'
export type BankPaymentStatus = 'pending' | 'verified' | 'rejected'

export interface BankAccount {
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
}

export interface BankPayment {
  id: string
  orderId: string
  orderNumber: string
  customerName: string
  amount: number
  purpose: BankPaymentPurpose
  status: BankPaymentStatus
  reference?: string
  depositedAt: string
  createdAt: string
  slipName?: string
  slipDataUrl?: string
  note?: string
  verifiedAt?: string
}

export interface TenantProfile {
  businessName: string
  ownerName: string
  phone: string
  email: string
  registrationNo?: string
  plan: 'free' | 'starter' | 'growth' | 'pro'
  languages: Array<'en' | 'si' | 'ta'>
  districtsServed: string[]
  returnPolicy: string
  logoInitials: string
  bankAccount: BankAccount
}
