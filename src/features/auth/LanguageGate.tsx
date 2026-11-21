import type { ReactNode } from 'react'
import { useLocaleStore } from '@/stores/useLocaleStore'
import type { Locale } from '@/i18n/types'
import { translate } from '@/i18n'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { Pictogram } from '@/components/kade/Pictogram'
import { cn } from '@/lib/utils'

const choices: Array<{ id: Locale; title: string; native: string }> = [
  { id: 'si', title: 'Sinhala', native: 'සිංහල' },
  { id: 'ta', title: 'Tamil', native: 'தமிழ்' },
  { id: 'en', title: 'English', native: 'English' },
]

export function LanguageGate({ children }: { children: ReactNode }) {
  const languagePicked = useLocaleStore((s) => s.languagePicked)
  const locale = useLocaleStore((s) => s.locale)
  const pickLanguage = useLocaleStore((s) => s.pickLanguage)

  if (languagePicked) return children

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-surface p-6">
        <div className="mb-4 flex items-center gap-3">
          <Pictogram id="speaker" className="h-12 w-12" />
          <div>
            <p className="text-2xl font-extrabold text-ink">
              {translate(locale, 'lang.pickTitle')}
            </p>
            <p className="text-base text-muted">{translate(locale, 'lang.pickHint')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {choices.map((c) => (
            <div key={c.id} className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => pickLanguage(c.id)}
                className={cn(
                  'min-h-16 flex-1 rounded-xl border-2 border-ink bg-cash px-4 py-3 text-left text-ink active:translate-y-px',
                )}
              >
                <span className="block text-2xl font-extrabold">{c.native}</span>
                <span className="text-sm font-bold opacity-80">{c.title}</span>
              </button>
              <SpeakButton text={c.native} label={c.native} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
