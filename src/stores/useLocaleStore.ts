import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n/types'

interface LocaleState {
  locale: Locale
  languagePicked: boolean
  simpleMode: boolean
  setLocale: (locale: Locale) => void
  pickLanguage: (locale: Locale) => void
  setSimpleMode: (v: boolean) => void
}

function applyDocumentLang(locale: Locale) {
  document.documentElement.lang = locale
  document.documentElement.dir = 'ltr'
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      languagePicked: false,
      simpleMode: true,
      setLocale: (locale) => {
        applyDocumentLang(locale)
        set({ locale })
      },
      pickLanguage: (locale) => {
        applyDocumentLang(locale)
        set({ locale, languagePicked: true, simpleMode: true })
      },
      setSimpleMode: (simpleMode) => set({ simpleMode }),
    }),
    {
      name: 'ssos-locale',
      onRehydrateStorage: () => (state) => {
        if (state?.locale) applyDocumentLang(state.locale)
      },
    },
  ),
)

export function bootstrapLocale() {
  try {
    const raw = localStorage.getItem('ssos-locale')
    if (!raw) return
    const parsed = JSON.parse(raw) as { state?: { locale?: Locale } }
    const locale = parsed.state?.locale
    if (locale === 'en' || locale === 'si' || locale === 'ta') {
      applyDocumentLang(locale)
    }
  } catch {
    /* ignore */
  }
}
