import { en } from './messages/en'
import { si } from './messages/si'
import { ta } from './messages/ta'
import type { Locale, MessageTree } from './types'
import { useLocaleStore } from '@/stores/useLocaleStore'

const catalogs: Record<Locale, MessageTree> = { en, si, ta }

function getByPath(tree: MessageTree, path: string): string | undefined {
  const parts = path.split('.')
  let cur: string | MessageTree | undefined = tree
  for (const part of parts) {
    if (!cur || typeof cur === 'string') return undefined
    cur = cur[part]
  }
  return typeof cur === 'string' ? cur : undefined
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw =
    getByPath(catalogs[locale], key) ??
    getByPath(catalogs.en, key) ??
    key
  if (!vars) return raw
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    raw,
  )
}

/** Hook-friendly translator bound to current locale. */
export function useT() {
  const locale = useLocaleStore((s) => s.locale)
  return (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, vars)
}

export type { Locale }
