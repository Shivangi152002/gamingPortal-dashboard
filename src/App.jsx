import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Common/Layout'
import AdminDashboard from './pages/AdminDashboard'
import GameManagement from './pages/GameManagement'
import GameRanking from './pages/GameRanking'
import AWSConsole from './pages/AWSConsole'
import Analytics from './pages/Analytics'
import UserManagement from './pages/UserManagement'
import SiteSettings from './pages/SiteSettings'
import BannerManagement from './pages/BannerManagement'
import Login from './pages/Login'
import ErrorBoundary from './components/Common/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CustomThemeProvider } from './context/ThemeContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="games/*" element={<GameManagement />} />
          <Route path="ranking" element={<GameRanking />} />
          <Route path="aws/*" element={<AWSConsole />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </CustomThemeProvider>
  )
}

export default App
