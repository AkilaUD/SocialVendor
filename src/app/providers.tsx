import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { LanguageGate } from '@/features/auth/LanguageGate'

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  )

  return (
    <QueryClientProvider client={client}>
      <LanguageGate>{children}</LanguageGate>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'border border-line bg-surface text-ink shadow-[var(--shadow-desk)]',
          },
        }}
      />
    </QueryClientProvider>
  )
}
