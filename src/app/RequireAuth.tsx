import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'

export function RequireAuth() {
  const authenticated = useAppStore((s) => s.authenticated)
  const onboardingDone = useAppStore((s) => s.onboardingDone)
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!onboardingDone && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
