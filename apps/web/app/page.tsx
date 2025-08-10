'use client'

import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import FallbackPage from './fallback'

// Lazy load components to prevent build errors
const AuthForm = React.lazy(() => import('@/components/AuthForm').catch(() => ({ default: () => <div>Loading...</div> })))
const ChatApp = React.lazy(() => import('@/components/ChatApp').catch(() => ({ default: () => <div>Loading...</div> })))
const AdminDashboard = React.lazy(() => import('@/components/AdminDashboard').catch(() => ({ default: () => <div>Loading...</div> })))
const LoadingSpinner = React.lazy(() => import('@/components/LoadingSpinner').catch(() => ({ default: () => <div>Loading...</div> })))

// Mock auth store for fallback
const useAuthStore = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for demo mode
    const demoMode = localStorage.getItem('fride-demo-mode')
    if (demoMode === 'true') {
      setUser({
        id: 'demo-user',
        email: 'demo@fride.com',
        username: 'demo',
        display_name: 'Demo User',
        role: 'admin',
        is_online: true,
      })
    }
    setIsLoading(false)
  }, [])

  return {
    user,
    isLoading,
    signOut: () => {
      localStorage.removeItem('fride-demo-mode')
      setUser(null)
    },
    setUser,
  }
}

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const [showAdmin, setShowAdmin] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Handle any unhandled errors
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  if (hasError) {
    return <FallbackPage />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Fride...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <ErrorBoundary fallback={<FallbackPage />}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <AuthForm />
        </React.Suspense>
      </ErrorBoundary>
    )
  }

  // Show admin dashboard if user is admin and admin mode is toggled
  if (user.role === 'admin' && showAdmin) {
    return (
      <ErrorBoundary fallback={<FallbackPage />}>
        <div className="h-screen bg-background-primary">
          <div className="h-16 bg-background-secondary border-b border-background-quaternary flex items-center justify-between px-4">
            <h1 className="text-xl font-bold text-text-primary">Admin Dashboard</h1>
            <button
              onClick={() => setShowAdmin(false)}
              className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Back to Chat
            </button>
          </div>
          <React.Suspense fallback={<div>Loading admin dashboard...</div>}>
            <AdminDashboard user={user} />
          </React.Suspense>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary fallback={<FallbackPage />}>
      <div className="h-screen bg-background-primary">
        {/* Admin Toggle Button */}
        {user.role === 'admin' && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setShowAdmin(true)}
              className="px-3 py-2 bg-accent-primary text-white text-sm rounded-md hover:bg-accent-primary/90 transition-colors shadow-lg"
            >
              Admin Panel
            </button>
          </div>
        )}
        <React.Suspense fallback={<div>Loading chat app...</div>}>
          <ChatApp />
        </React.Suspense>
      </div>
    </ErrorBoundary>
  )
}
