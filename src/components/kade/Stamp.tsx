import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const stampColors: Record<string, string> = {
  packed: 'text-lagoon',
  sent: 'text-lagoon',
  delivered: 'text-ok',
  paid: 'text-ok',
  returned: 'text-risk',
  ready: 'text-ok',
  confirmed: 'text-lagoon',
}

export function Stamp({
  label,
  kind = 'confirmed',
  show,
  className,
}: {
  label: string
  kind?: keyof typeof stampColors | string
  show: boolean
  className?: string
}) {
  const [landed, setLanded] = useState(false)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!show) {
      setLanded(false)
      return
    }
    if (reduced) {
      setLanded(true)
      return
    }
    const t = window.setTimeout(() => setLanded(true), 40)
    try {
      navigator.vibrate?.(40)
    } catch {
      /* ignore */
    }
    return () => window.clearTimeout(t)
  }, [show, reduced])

  if (!show) return null

  return (
    <div
      className={cn(
        'stamp-ink pointer-events-none px-3 py-1.5 text-xl',
        stampColors[kind] ?? 'text-lagoon',
        landed ? 'opacity-95 scale-100' : 'opacity-0 scale-150',
        !reduced && 'transition-all duration-200',
        className,
      )}
      aria-live="polite"
    >
      {label}
    </div>
  )
}
