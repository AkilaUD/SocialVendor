import { cn } from '@/lib/utils'

export function ProductSwatch({
  title,
  hue,
  className,
}: {
  title: string
  hue: number
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 42% 42%), hsl(${hue + 24} 35% 22%))`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay desk-grid" />
      <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-semibold uppercase tracking-wider text-white/80">
        {title}
      </div>
    </div>
  )
}
