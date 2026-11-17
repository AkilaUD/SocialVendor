import { useLocaleStore } from '@/stores/useLocaleStore'
import type { Locale } from '@/i18n/types'
import { cn } from '@/lib/utils'

const options: Array<{ id: Locale; label: string; short: string }> = [
  { id: 'en', label: 'EN', short: 'EN' },
  { id: 'si', label: 'සිං', short: 'සිං' },
  { id: 'ta', label: 'தமிழ்', short: 'த' },
]

export function LanguageSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-1',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {!compact ? (
        <span className="hidden px-2 text-[11px] font-semibold uppercase tracking-wide text-muted sm:inline">
          Lang
        </span>
      ) : null}
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={locale === o.id}
          aria-label={o.label}
          onClick={() => setLocale(o.id)}
          className={cn(
            'min-h-11 min-w-9 rounded-full px-2 text-xs font-semibold transition sm:px-2.5',
            locale === o.id
              ? 'bg-ink text-on-ink'
              : 'text-muted hover:bg-paper-2 hover:text-ink',
          )}
        >
          <span className="min-[380px]:hidden">{o.short}</span>
          <span className="hidden min-[380px]:inline">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
