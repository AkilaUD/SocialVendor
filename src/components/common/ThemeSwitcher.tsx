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
        'inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 sm:gap-1',
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
          aria-label={t.label}
          aria-pressed={theme === t.id}
          onClick={() => setTheme(t.id as ThemeId)}
          className={cn(
            'min-h-11 min-w-9 rounded-full px-2 text-xs font-semibold transition sm:min-w-0 sm:px-2.5',
            theme === t.id
              ? 'bg-ink text-on-ink'
              : 'text-muted hover:bg-paper-2 hover:text-ink',
          )}
        >
          <span className="sm:hidden">{t.label.slice(0, 1)}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
