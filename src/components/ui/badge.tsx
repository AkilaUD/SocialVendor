import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex max-w-full items-center whitespace-normal break-words rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide [html[lang=en]_&]:uppercase',
  {
    variants: {
      variant: {
        default: 'bg-ink/90 text-mint',
        lagoon: 'bg-lagoon/15 text-lagoon',
        cash: 'bg-cash/25 text-ink',
        muted: 'bg-paper-2 text-muted',
        ok: 'bg-ok/15 text-ok',
        risk: 'bg-risk/12 text-risk',
        outline: 'border border-line text-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
