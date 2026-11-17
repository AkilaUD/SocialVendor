import type { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  tip,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  tip?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-2xl font-extrabold text-ink md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted md:text-base">{description}</p> : null}
        {tip ? (
          <p className="mt-2 inline-flex max-w-2xl items-start gap-2 rounded-lg bg-lagoon/10 px-3 py-2 text-sm text-ink-soft">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" />
            <span>{tip}</span>
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
