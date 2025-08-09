'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@fride/types'
import { supabase } from '../lib/supabase'

interface AdminDashboardProps {
  user: User
}

interface Stats {
  totalUsers: number
  totalChannels: number
  totalMessages: number
  totalTickets: number
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalChannels: 0,
    totalMessages: 0,
    totalTickets: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showManageUsers, setShowManageUsers] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text')
  const [newChannelDescription, setNewChannelDescription] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch counts from database
      const [users, channels, messages, tickets] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('channels').select('id', { count: 'exact' }),
        supabase.from('messages').select('id', { count: 'exact' }),
        supabase.from('tickets').select('id', { count: 'exact' })
      ])

      setStats({
        totalUsers: users.count || 0,
        totalChannels: channels.count || 0,
        totalMessages: messages.count || 0,
        totalTickets: tickets.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return
    
    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('channels')
        .insert({
          name: newChannelName.trim(),
          type: newChannelType,
          description: newChannelDescription.trim() || null,
          created_by: user.id
        })

      if (error) throw error

      // Reset form and close modal
      setNewChannelName('')
      setNewChannelType('text')
      setNewChannelDescription('')
      setShowCreateChannel(false)
      
      // Refresh stats
      await fetchStats()
      
    } catch (error) {
      console.error('Error creating channel:', error)
      alert('Failed to create channel')
    } finally {
      setActionLoading(false)
    }
  }

  const handleManageUsers = () => {
    setShowManageUsers(true)
    // In a real app, this would open a user management modal/component
  }

  const handleViewLogs = () => {
    setShowLogs(true)
    // In a real app, this would open a logs viewer
  }

  const handleServerSettings = () => {
    setShowSettings(true)
    // In a real app, this would open server settings
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Admin Dashboard
        </h2>
        <p className="text-text-secondary">
          Welcome back, {user.display_name}! Here's an overview of your server.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-background-secondary p-6 rounded-lg border border-border">
          <h3 className="text-text-secondary text-sm font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-text-primary">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-background-secondary p-6 rounded-lg border border-border">
          <h3 className="text-text-secondary text-sm font-medium mb-2">Total Channels</h3>
          <p className="text-3xl font-bold text-text-primary">{stats.totalChannels}</p>
        </div>
        
        <div className="bg-background-secondary p-6 rounded-lg border border-border">
          <h3 className="text-text-secondary text-sm font-medium mb-2">Total Messages</h3>
          <p className="text-3xl font-bold text-text-primary">{stats.totalMessages}</p>
        </div>
        
        <div className="bg-background-secondary p-6 rounded-lg border border-border">
          <h3 className="text-text-secondary text-sm font-medium mb-2">Open Tickets</h3>
          <p className="text-3xl font-bold text-text-primary">{stats.totalTickets}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background-secondary p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowCreateChannel(true)}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Create Channel
          </button>
          <button 
            onClick={handleManageUsers}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Manage Users
          </button>
          <button 
            onClick={handleViewLogs}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            View Logs
          </button>
          <button 
            onClick={handleServerSettings}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Server Settings
          </button>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-primary p-6 rounded-lg border border-border max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Create New Channel</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="general"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Channel Type
                </label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value as 'text' | 'voice')}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="text">Text Channel</option>
                  <option value="voice">Voice Channel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  rows={3}
                  placeholder="Channel description..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateChannel(false)}
                className="flex-1 px-4 py-2 bg-background-secondary text-text-primary rounded-md hover:bg-background-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={actionLoading || !newChannelName.trim()}
                className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Creating...' : 'Create Channel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder modals for other actions */}
      {showManageUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-primary p-6 rounded-lg border border-border max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Manage Users</h3>
            <p className="text-text-secondary mb-4">User management interface coming soon...</p>
            <button
              onClick={() => setShowManageUsers(false)}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-primary p-6 rounded-lg border border-border max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Server Logs</h3>
            <p className="text-text-secondary mb-4">Log viewer interface coming soon...</p>
            <button
              onClick={() => setShowLogs(false)}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-primary p-6 rounded-lg border border-border max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Server Settings</h3>
            <p className="text-text-secondary mb-4">Server settings interface coming soon...</p>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
