import { Palette } from 'lucide-react'
import { THEMES, useThemeStore, type ThemeId } from '@/stores/useThemeStore'
import { cn } from '@/lib/utils'

export function ThemeSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1',
        className,
      )}
      role="group"
      aria-label="Color theme"
    >
      {!compact ? (
        <span className="hidden items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted sm:inline-flex">
          <Palette className="h-3.5 w-3.5" /> Theme
        </span>
      ) : null}
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.hint}
          aria-pressed={theme === t.id}
          onClick={() => setTheme(t.id as ThemeId)}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold transition',
            theme === t.id
              ? 'bg-ink text-on-ink'
              : 'text-muted hover:bg-paper-2 hover:text-ink',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
