import type { ReactNode } from 'react'
import { Volume2 } from 'lucide-react'
import { useLocaleStore } from '@/stores/useLocaleStore'
import type { Locale } from '@/i18n/types'
import { speak } from '@/lib/speak'
import { cn } from '@/lib/utils'

const choices: Array<{ id: Locale; native: string; welcome: string }> = [
  { id: 'si', native: 'සිංහල', welcome: 'ආයුබෝවන්. ඔයාගේ කඩේ මෙතනින් පටන් ගමු.' },
  { id: 'ta', native: 'தமிழ்', welcome: 'வணக்கம். உங்கள் கடையை இங்கே தொடங்குவோம்.' },
  { id: 'en', native: 'English', welcome: 'Welcome. Let’s start your shop here.' },
]

export function LanguageGate({ children }: { children: ReactNode }) {
  const languagePicked = useLocaleStore((s) => s.languagePicked)
  const pickLanguage = useLocaleStore((s) => s.pickLanguage)

  if (languagePicked) return children

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md space-y-4">
        {choices.map((c) => (
          <div key={c.id} className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                speak(c.welcome, c.id)
                pickLanguage(c.id)
              }}
              className={cn(
                'flex min-h-20 flex-1 items-center justify-center rounded-2xl border-4 border-ink bg-cash px-4 py-4',
                'font-display text-3xl font-extrabold text-ink active:translate-y-px',
              )}
            >
              {c.native}
            </button>
            <button
              type="button"
              aria-label="Hear"
              className="flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-ink bg-surface"
              onClick={() => speak(c.welcome, c.id)}
            >
              <Volume2 className="h-7 w-7" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
