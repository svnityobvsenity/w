import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import Avatar from './Avatar'
import Button from './Button'

export interface VoiceUser {
  id: string
  name: string
  avatar?: string
  status: 'speaking' | 'muted' | 'deafened' | 'streaming' | 'video' | 'idle'
  isLocalUser?: boolean
  volume?: number
  isServerMuted?: boolean
  isServerDeafened?: boolean
  speaking?: boolean
}

export interface VoiceTileProps {
  users: VoiceUser[]
  channelName: string
  isConnected: boolean
  isMuted: boolean
  isDeafened: boolean
  isStreaming: boolean
  isVideoOn: boolean
  onToggleMute?: () => void
  onToggleDeafen?: () => void
  onToggleStream?: () => void
  onToggleVideo?: () => void
  onLeaveVoice?: () => void
  onUserVolumeChange?: (userId: string, volume: number) => void
  onUserMute?: (userId: string) => void
  onUserDeafen?: (userId: string) => void
  canManageUsers?: boolean
  className?: string
  variant?: 'sidebar' | 'mobile' | 'fullscreen'
}

export const VoiceTile: React.FC<VoiceTileProps> = ({
  users,
  channelName,
  isConnected,
  isMuted,
  isDeafened,
  isStreaming,
  isVideoOn,
  onToggleMute,
  onToggleDeafen,
  onToggleStream,
  onToggleVideo,
  onLeaveVoice,
  onUserVolumeChange,
  onUserMute,
  onUserDeafen,
  canManageUsers = false,
  className,
  variant = 'sidebar',
}) => {
  const [showUserControls, setShowUserControls] = useState<string | null>(null)
  const [localVolume, setLocalVolume] = useState<Record<string, number>>({})

  const handleVolumeChange = (userId: string, volume: number) => {
    setLocalVolume(prev => ({ ...prev, [userId]: volume }))
    onUserVolumeChange?.(userId, volume)
  }

  const getStatusIcon = (user: VoiceUser) => {
    if (user.isServerDeafened || user.status === 'deafened') {
      return (
        <svg className="w-4 h-4 text-discord-accent-red" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (user.isServerMuted || user.status === 'muted') {
      return (
        <svg className="w-4 h-4 text-discord-accent-red" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )
    }

    if (user.status === 'streaming') {
      return (
        <svg className="w-4 h-4 text-discord-accent-purple" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.882l-1.883 1.883c-.5.5-1.322.5-1.822 0L5 13.118V13a2 2 0 01-2-2V7a2 2 0 012-2h9a2 2 0 012 2z" />
        </svg>
      )
    }

    if (user.status === 'video') {
      return (
        <svg className="w-4 h-4 text-discord-accent-green" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      )
    }

    if (user.speaking) {
      return (
        <div className="w-4 h-4 bg-discord-accent-green rounded-full animate-pulse" />
      )
    }

    return null
  }

  const renderUser = (user: VoiceUser) => {
    const volume = localVolume[user.id] ?? (user.volume ?? 100)
    
    return (
      <div
        key={user.id}
        className={cn(
          'group relative flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors',
          user.speaking && 'bg-discord-accent-green/20',
          'hover:bg-discord-tertiary'
        )}
        onMouseEnter={() => setShowUserControls(user.id)}
        onMouseLeave={() => setShowUserControls(null)}
      >
        {/* User avatar with speaking indicator */}
        <div className="relative flex-shrink-0 mr-3">
          <Avatar
            src={user.avatar}
            fallback={user.name}
            size="sm"
            status={user.speaking ? 'online' : 'offline'}
          />
          {user.speaking && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-discord-accent-green rounded-full border-2 border-discord-background-primary animate-pulse" />
          )}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-discord-text-primary truncate">
              {user.name}
              {user.isLocalUser && ' (you)'}
            </span>
            {getStatusIcon(user)}
          </div>
          
          {/* Volume slider */}
          {variant !== 'mobile' && (
            <div className="flex items-center space-x-2 mt-1">
              <svg className="w-3 h-3 text-discord-text-muted" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(user.id, parseInt(e.target.value))}
                className="w-16 h-1 bg-discord-elevated rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #5865f2 0%, #5865f2 ${volume}%, #4f545c ${volume}%, #4f545c 100%)`
                }}
              />
            </div>
          )}
        </div>

        {/* User controls */}
        {showUserControls === user.id && canManageUsers && !user.isLocalUser && (
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onUserMute?.(user.id)}
              className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-elevated"
              title={user.isServerMuted ? 'Unmute user' : 'Mute user'}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onUserDeafen?.(user.id)}
              className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-elevated"
              title={user.isServerDeafened ? 'Undeafen user' : 'Deafen user'}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <p className="text-discord-text-muted text-sm">Not connected to voice</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-discord-elevated">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-discord-text-muted" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-discord-text-primary">
            {channelName}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-xs text-discord-text-muted">
            {users.length} online
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="py-2 max-h-64 overflow-y-auto">
        {users.map(renderUser)}
      </div>

      {/* Voice controls */}
      <div className="flex items-center justify-center space-x-2 p-3 border-t border-discord-elevated">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onToggleMute}
          className={cn(
            'transition-colors',
            isMuted
              ? 'text-discord-accent-red hover:bg-discord-accent-red/20'
              : 'text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary'
          )}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="iconSm"
          onClick={onToggleDeafen}
          className={cn(
            'transition-colors',
            isDeafened
              ? 'text-discord-accent-red hover:bg-discord-accent-red/20'
              : 'text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary'
          )}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        </Button>

        {onToggleStream && (
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onToggleStream}
            className={cn(
              'transition-colors',
              isStreaming
                ? 'text-discord-accent-purple hover:bg-discord-accent-purple/20'
                : 'text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary'
            )}
            title={isStreaming ? 'Stop streaming' : 'Start streaming'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.882l-1.883 1.883c-.5.5-1.322.5-1.822 0L5 13.118V13a2 2 0 01-2-2V7a2 2 0 012-2h9a2 2 0 012 2z" />
            </svg>
          </Button>
        )}

        {onToggleVideo && (
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onToggleVideo}
            className={cn(
              'transition-colors',
              isVideoOn
                ? 'text-discord-accent-green hover:bg-discord-accent-green/20'
                : 'text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary'
            )}
            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </Button>
        )}

        <Button
          variant="ghost"
          size="iconSm"
          onClick={onLeaveVoice}
          className="text-discord-accent-red hover:bg-discord-accent-red/20"
          title="Leave voice channel"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default VoiceTile
