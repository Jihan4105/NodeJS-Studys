import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DashBoard from './DashBoard'

createRoot(document.getElementById('dashboard-root')).render(
  <StrictMode>
    <DashBoard />
  </StrictMode>,
)
