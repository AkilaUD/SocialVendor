import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { bootstrapTheme } from '@/stores/useThemeStore'
import { bootstrapLocale } from '@/stores/useLocaleStore'
import './index.css'

bootstrapTheme()
bootstrapLocale()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
)
