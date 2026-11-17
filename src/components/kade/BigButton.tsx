import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SpeakButton } from '@/components/kade/SpeakButton'
import { cn } from '@/lib/utils'

type Tone = 'primary' | 'done' | 'danger' | 'board' | 'ghost'

const tones: Record<Tone, string> = {
  primary: 'bg-cash text-ink border-ink',
  done: 'bg-ok text-white border-ink',
  danger: 'bg-risk text-white border-ink',
  board: 'bg-lagoon text-white border-ink',
  ghost: 'bg-surface text-ink border-ink',
}

export function BigButton({
  children,
  icon,
  speakText,
  tone = 'primary',
  className,
  onClick,
  type = 'button',
  disabled,
  to,
}: {
  children: ReactNode
  icon?: ReactNode
  speakText?: string
  tone?: Tone
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  to?: string
}) {
  const inner = (
    <>
      {icon ? <span className="flex h-10 w-10 shrink-0 items-center justify-center">{icon}</span> : null}
      <span className="min-w-0 flex-1 text-left text-lg font-extrabold leading-snug">{children}</span>
    </>
  )

  const btnClass = cn(
    'inline-flex min-h-16 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 active:translate-y-px disabled:opacity-50',
    tones[tone],
    className,
  )

  return (
    <div className="flex w-full items-stretch gap-2">
      {to ? (
        <Link to={to} className={btnClass} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type={type} disabled={disabled} className={btnClass} onClick={onClick}>
          {inner}
        </button>
      )}
      {speakText ? <SpeakButton text={speakText} /> : null}
    </div>
  )
}
