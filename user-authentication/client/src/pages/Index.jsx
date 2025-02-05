import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import IndexApp from './IndexApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IndexApp />
  </StrictMode>,
)
