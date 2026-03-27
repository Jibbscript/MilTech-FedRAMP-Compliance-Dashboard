import '@fontsource-variable/dm-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SaronicDashboard } from '@/app/SaronicDashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaronicDashboard />
  </StrictMode>,
)
