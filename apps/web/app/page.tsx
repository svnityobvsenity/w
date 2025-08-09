'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth'
import AuthForm from '@/components/AuthForm'
import ChatApp from '@/components/ChatApp'
import AdminDashboard from '@/components/AdminDashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const [showAdmin, setShowAdmin] = useState(false)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthForm />
  }

  // Show admin dashboard if user is admin and admin mode is toggled
  if (user.role === 'admin' && showAdmin) {
    return (
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
        <AdminDashboard user={user} />
      </div>
    )
  }

  return (
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
      <ChatApp />
    </div>
  )
}
