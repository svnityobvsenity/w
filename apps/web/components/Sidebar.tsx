'use client'

import React, { useState } from 'react'
import { Channel, User } from '@fride/types'
import { useAppStore } from '../lib/store'

interface SidebarProps {
  channels: Channel[]
  user: User
  onChannelSelect: (channelId: string) => void
  activeChannelId?: string | null
  onSignOut?: () => void
  onAdminClick?: () => void
}

export default function Sidebar({ 
  channels, 
  user, 
  onChannelSelect, 
  activeChannelId,
  onSignOut,
  onAdminClick
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    setIsCollapsed(newState)
  }

  const textChannels = channels.filter(ch => ch.type === 'text')
  const voiceChannels = channels.filter(ch => ch.type === 'voice')

  if (isCollapsed) {
    return (
      <div className="w-16 bg-background-secondary border-r border-border flex flex-col items-center py-4">
        <button
          onClick={toggleCollapse}
          className="p-2 hover:bg-background-tertiary rounded-md transition-colors mb-4"
          title="Expand Sidebar"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* User Avatar */}
        <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center mb-4">
          <span className="text-sm font-medium text-white">
            {user.display_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Admin Button */}
        {user.role === 'admin' && onAdminClick && (
          <button
            onClick={onAdminClick}
            className="p-2 hover:bg-accent-primary rounded-md transition-colors mb-4"
            title="Admin Panel"
          >
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-background-secondary border-r border-border flex flex-col">
      {/* Header */}
      <div className="h-14 bg-background-tertiary border-b border-border flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold text-text-primary">Fride</h2>
        <button
          onClick={toggleCollapse}
          className="p-1 hover:bg-background-quaternary rounded transition-colors"
          title="Collapse Sidebar"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user.display_name}
            </p>
            <p className="text-xs text-text-muted truncate">
              {user.username}#{user.discriminator}
            </p>
          </div>
          <div className="flex space-x-1">
            {user.role === 'admin' && onAdminClick && (
              <button
                onClick={onAdminClick}
                className="p-1 hover:bg-background-quaternary rounded transition-colors"
                title="Admin Panel"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1 hover:bg-background-quaternary rounded transition-colors"
                title="Sign Out"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {/* Text Channels */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Text Channels
          </h3>
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  activeChannelId === channel.id
                    ? 'bg-accent-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <span className="text-lg">#</span>
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Voice Channels
          </h3>
          <div className="space-y-1">
            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  activeChannelId === channel.id
                    ? 'bg-accent-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
