import { Volume2 } from 'lucide-react'
import { speak } from '@/lib/speak'
import { useLocaleStore } from '@/stores/useLocaleStore'
import { cn } from '@/lib/utils'

export function SpeakButton({
  text,
  className,
  label = 'Hear this',
}: {
  text: string
  className?: string
  label?: string
}) {
  const locale = useLocaleStore((s) => s.locale)
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-surface text-ink active:scale-95',
        className,
      )}
      onClick={() => speak(text, locale)}
    >
      <Volume2 className="h-6 w-6" />
    </button>
  )
}
