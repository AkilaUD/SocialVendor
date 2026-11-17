import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'lagoon' | 'night' | 'market'

export const THEMES: Array<{ id: ThemeId; label: string; hint: string }> = [
  { id: 'lagoon', label: 'Lagoon', hint: 'Teal desk' },
  { id: 'night', label: 'Night', hint: 'Low glare' },
  { id: 'market', label: 'Market', hint: 'Bright day' },
]

interface ThemeState {
  theme: ThemeId
  coachDismissed: boolean
  setTheme: (theme: ThemeId) => void
  dismissCoach: () => void
}

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'lagoon',
      coachDismissed: false,
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      dismissCoach: () => set({ coachDismissed: true }),
    }),
    {
      name: 'ssos-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme)
      },
    },
  ),
)

/** Call once at boot so first paint matches storage before React mounts. */
export function bootstrapTheme() {
  try {
    const raw = localStorage.getItem('ssos-theme')
    if (!raw) {
      applyTheme('lagoon')
      return
    }
    const parsed = JSON.parse(raw) as { state?: { theme?: ThemeId } }
    const theme = parsed.state?.theme
    applyTheme(theme === 'night' || theme === 'market' || theme === 'lagoon' ? theme : 'lagoon')
  } catch {
    applyTheme('lagoon')
  }
}
