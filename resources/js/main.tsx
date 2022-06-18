import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
const container = document.getElementById('app') as HTMLDivElement
const root = createRoot(container)
import './assets/scss/index.scss'
declare global {
  type Nullable<T> = null | T
}

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
