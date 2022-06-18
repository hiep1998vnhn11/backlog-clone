import { Routes, Route, useLocation } from 'react-router-dom'
import { AppContextProvider } from './context/useApp'

import IndexPage from './pages/index'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import OrderPage from './pages/orders'
import CreateOrderPage from './pages/orders/create'
import EditOrderPage from './pages/orders/edit'
import ProductPage from './pages'
import SettingPage from './pages/settings'
import AccountPage from './pages/account'
import AccountsPage from './pages/accounts'
import ShowAccountsPage from './pages/accounts/show'
import ProjectPage from './pages/projects'

import Page404 from './pages/404'

import { CacheProvider } from '@emotion/react'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import { createEmotionCache } from './utils/create-emotion-cache'
import { theme } from './theme'
import { DashboardLayout } from '/@/components/dashboard-layout'

const clientSideEmotionCache = createEmotionCache()

const AuthGuard: React.FC<any> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>
}

function App() {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <Routes>
                      <Route path="/" element={<IndexPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/orders" element={<OrderPage />} />
                      <Route path="/orders/shares" element={<OrderPage />} />
                      <Route path="/orders/drafts" element={<ProductPage />} />
                      <Route
                        path="/orders/shippings"
                        element={<SettingPage />}
                      />
                      <Route
                        path="/orders/create"
                        element={<CreateOrderPage />}
                      />
                      <Route path="/orders/:id" element={<EditOrderPage />} />
                      <Route path="/accounts" element={<AccountsPage />} />
                      <Route
                        path="/accounts/:id"
                        element={<ShowAccountsPage />}
                      />
                      <Route path="/projects/:key" element={<ProjectPage />} />
                    </Routes>
                    <Routes>
                      <Route path="*" element={<Page404 />} />
                    </Routes>
                  </AuthGuard>
                }
              />
            </Routes>
          </AppContextProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  )
}
export default App
