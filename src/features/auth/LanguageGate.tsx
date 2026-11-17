import type { ReactNode } from 'react'
import { useLocaleStore } from '@/stores/useLocaleStore'
import type { Locale } from '@/i18n/types'
import { translate } from '@/i18n'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const choices: Array<{ id: Locale; title: string; native: string }> = [
  { id: 'en', title: 'English', native: 'English' },
  { id: 'si', title: 'Sinhala', native: 'සිංහල' },
  { id: 'ta', title: 'Tamil', native: 'தமிழ்' },
]

export function LanguageGate({ children }: { children: ReactNode }) {
  const languagePicked = useLocaleStore((s) => s.languagePicked)
  const locale = useLocaleStore((s) => s.locale)
  const pickLanguage = useLocaleStore((s) => s.pickLanguage)

  if (languagePicked) return children

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center paper-noise p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-float)]">
        <p className="font-display text-2xl font-extrabold text-ink">
          {translate(locale, 'lang.pickTitle')}
        </p>
        <p className="mt-2 text-sm text-muted">{translate(locale, 'lang.pickHint')}</p>
        <div className="mt-6 flex flex-col gap-3">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickLanguage(c.id)}
              className={cn(
                'min-h-14 rounded-xl border px-4 py-3 text-left transition',
                'border-line bg-paper hover:border-lagoon hover:bg-lagoon/10',
              )}
            >
              <span className="block font-display text-xl font-bold text-ink">{c.native}</span>
              <span className="text-sm text-muted">{c.title}</span>
            </button>
          ))}
        </div>
        <Button
          className="mt-5 w-full min-h-12"
          variant="lagoon"
          onClick={() => pickLanguage(locale)}
        >
          {translate(locale, 'lang.continue')}
        </Button>
      </div>
    </div>
  )
}
