import { Routes, Route, useLocation } from 'react-router-dom'
import { AppContextProvider } from './context/useApp'

import IndexPage from './pages/index'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import AccountPage from './pages/account'
import ProjectPage from './pages/projects'
import ProjectAddIssuePage from './pages/projects/add'
import ProjectBoardPage from './pages/projects/board'
import ProjectGanttPage from './pages/projects/gantt'
import ProjectIssuesPage from './pages/projects/issues'
import ProjectSettingPage from './pages/projects/setting'

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
                      <Route path="/projects/:key" element={<ProjectPage />} />
                      <Route
                        path="/projects/:key/add"
                        element={<ProjectAddIssuePage />}
                      />
                      <Route
                        path="/projects/:key/board"
                        element={<ProjectBoardPage />}
                      />
                      <Route
                        path="/projects/:key/issues"
                        element={<ProjectIssuesPage />}
                      />
                      <Route
                        path="/projects/:key/gantt-chart"
                        element={<ProjectGanttPage />}
                      />
                      <Route
                        path="/projects/:key/setting"
                        element={<ProjectSettingPage />}
                      />
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
