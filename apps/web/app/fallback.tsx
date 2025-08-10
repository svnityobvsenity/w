'use client'

import React from 'react'

export default function FallbackPage() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-accent-primary mb-2">Fride</h1>
          <p className="text-text-secondary">Discord-like Chat App</p>
        </div>
        
        <div className="bg-background-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Welcome to Fride
          </h2>
          <p className="text-text-secondary mb-4">
            This is a preview deployment. Some features may not be fully functional yet.
          </p>
          
          <div className="space-y-2 text-sm text-text-muted">
            <p>✅ Real-time messaging</p>
            <p>✅ Voice channels</p>
            <p>✅ Admin dashboard</p>
            <p>✅ Ticket system</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => {
              // Mock login for demo
              localStorage.setItem('fride-demo-mode', 'true')
              window.location.reload()
            }}
            className="w-full px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors"
          >
            Enter Demo Mode
            </button>
        </div>

        <div className="mt-6 text-xs text-text-muted">
          <p>Build: {process.env.NEXT_PUBLIC_VERSION || '1.0.0'}</p>
          <p>Environment: {process.env.NODE_ENV || 'development'}</p>
        </div>
      </div>
    </div>
  )
}
