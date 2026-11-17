import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth } from '@/app/RequireAuth'

const LandingPage = lazy(() =>
  import('@/features/marketing/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const PricingPage = lazy(() =>
  import('@/features/marketing/PricingPage').then((m) => ({ default: m.PricingPage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const OnboardingPage = lazy(() =>
  import('@/features/auth/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const OrdersPage = lazy(() =>
  import('@/features/orders/OrdersPage').then((m) => ({ default: m.OrdersPage })),
)
const OrderDetailPage = lazy(() =>
  import('@/features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })),
)
const QuickOrderPage = lazy(() =>
  import('@/features/orders/QuickOrderPage').then((m) => ({ default: m.QuickOrderPage })),
)
const CustomersPage = lazy(() =>
  import('@/features/customers/CustomersPage').then((m) => ({ default: m.CustomersPage })),
)
const CustomerDetailPage = lazy(() =>
  import('@/features/customers/CustomerDetailPage').then((m) => ({ default: m.CustomerDetailPage })),
)
const ProductsPage = lazy(() =>
  import('@/features/products/ProductsPage').then((m) => ({ default: m.ProductsPage })),
)
const InventoryPage = lazy(() =>
  import('@/features/inventory/InventoryPage').then((m) => ({ default: m.InventoryPage })),
)
const DispatchPage = lazy(() =>
  import('@/features/dispatch/DispatchPage').then((m) => ({ default: m.DispatchPage })),
)
const CodPage = lazy(() => import('@/features/cod/CodPage').then((m) => ({ default: m.CodPage })))
const PaymentsPage = lazy(() =>
  import('@/features/payments/PaymentsPage').then((m) => ({ default: m.PaymentsPage })),
)
const ReturnsPage = lazy(() =>
  import('@/features/returns/ReturnsPage').then((m) => ({ default: m.ReturnsPage })),
)
const InvoicesPage = lazy(() =>
  import('@/features/invoices/InvoicesPage').then((m) => ({ default: m.InvoicesPage })),
)
const ExpensesPage = lazy(() =>
  import('@/features/expenses/ExpensesPage').then((m) => ({ default: m.ExpensesPage })),
)
const TicketsPage = lazy(() =>
  import('@/features/tickets/TicketsPage').then((m) => ({ default: m.TicketsPage })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const TrackingPage = lazy(() =>
  import('@/features/public/TrackingPage').then((m) => ({ default: m.TrackingPage })),
)
const MiniStorePage = lazy(() =>
  import('@/features/public/MiniStorePage').then((m) => ({ default: m.MiniStorePage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-lagoon border-t-transparent" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="track/:waybill" element={<TrackingPage />} />
        <Route path="store/:slug" element={<MiniStorePage />} />

        <Route element={<RequireAuth />}>
          <Route path="app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/new" element={<QuickOrderPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="dispatch" element={<DispatchPage />} />
            <Route path="cod" element={<CodPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
