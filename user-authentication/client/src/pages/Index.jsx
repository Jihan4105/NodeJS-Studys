import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from 'react-auth-kit'
import IndexApp from './IndexApp'

import createStore from 'react-auth-kit/createStore'

const authStore = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider store={authStore}>
      <IndexApp />
    </AuthProvider>
  </StrictMode>,
)
