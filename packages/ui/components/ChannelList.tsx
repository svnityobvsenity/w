import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import Button from './Button'

export interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'category'
  icon?: string
  unreadCount?: number
  isActive?: boolean
  isMuted?: boolean
  memberCount?: number
  maxMembers?: number
  isPrivate?: boolean
  isNSFW?: boolean
  description?: string
}

export interface ChannelListProps {
  channels: Channel[]
  selectedChannelId?: string
  onChannelSelect?: (channelId: string) => void
  onChannelCreate?: () => void
  onChannelEdit?: (channelId: string) => void
  onChannelDelete?: (channelId: string) => void
  canManageChannels?: boolean
  className?: string
  variant?: 'sidebar' | 'mobile'
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannelId,
  onChannelSelect,
  onChannelCreate,
  onChannelEdit,
  onChannelDelete,
  canManageChannels = false,
  className,
  variant = 'sidebar',
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleChannelClick = (channelId: string) => {
    onChannelSelect?.(channelId)
  }

  const handleContextMenu = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault()
    setShowContextMenu(channelId)
  }

  const closeContextMenu = () => {
    setShowContextMenu(null)
  }

  const getChannelIcon = (channel: Channel) => {
    if (channel.icon) {
      return <img src={channel.icon} alt="" className="w-4 h-4" />
    }

    switch (channel.type) {
      case 'text':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'voice':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const renderChannel = (channel: Channel) => {
    const isSelected = channel.id === selectedChannelId
    const isTextChannel = channel.type === 'text'
    const isVoiceChannel = channel.type === 'voice'

    return (
      <div
        key={channel.id}
        className={cn(
          'group relative flex items-center px-2 py-1.5 mx-1 rounded cursor-pointer transition-colors',
          isSelected
            ? 'bg-discord-accent-blue text-white'
            : 'text-discord-text-secondary hover:text-discord-text-primary hover:bg-discord-tertiary'
        )}
        onClick={() => handleChannelClick(channel.id)}
        onContextMenu={(e) => handleContextMenu(e, channel.id)}
      >
        {/* Channel icon */}
        <div className="flex-shrink-0 mr-2">
          {getChannelIcon(channel)}
        </div>

        {/* Channel name */}
        <span className="flex-1 text-sm font-medium truncate">
          {channel.name}
        </span>

        {/* Channel indicators */}
        <div className="flex items-center space-x-1 ml-2">
          {channel.unreadCount && channel.unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-discord-accent-red text-white rounded-full">
              {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
            </span>
          )}
          
          {channel.isMuted && (
            <svg className="w-4 h-4 text-discord-text-muted" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.383-3.207a1 1 0 011.617.793zM12.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-4.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-2.757 5.243 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 10a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}

          {isVoiceChannel && channel.memberCount !== undefined && (
            <span className="text-xs text-discord-text-muted">
              {channel.memberCount}
              {channel.maxMembers && `/${channel.maxMembers}`}
            </span>
          )}

          {channel.isPrivate && (
            <svg className="w-3 h-3 text-discord-text-muted" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}

          {channel.isNSFW && (
            <span className="text-xs font-bold text-discord-accent-red">NSFW</span>
          )}
        </div>

        {/* Context menu button */}
        {canManageChannels && (
          <button
            className="opacity-0 group-hover:opacity-100 ml-1 p-1 text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-elevated rounded transition-all"
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e, channel.id)
            }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        )}
      </div>
    )
  }

  const renderCategory = (category: Channel) => {
    const isExpanded = expandedCategories.has(category.id)
    const categoryChannels = channels.filter(ch => ch.type !== 'category')

    return (
      <div key={category.id} className="mb-1">
        {/* Category header */}
        <button
          className="flex items-center w-full px-2 py-1 text-xs font-semibold text-discord-text-muted hover:text-discord-text-primary transition-colors"
          onClick={() => toggleCategory(category.id)}
        >
          <svg
            className={cn(
              'w-3 h-3 mr-1 transition-transform',
              isExpanded ? 'rotate-90' : ''
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {category.name.toUpperCase()}
        </button>

        {/* Category channels */}
        {isExpanded && (
          <div className="ml-2 space-y-0.5">
            {categoryChannels.map(renderChannel)}
          </div>
        )}
      </div>
    )
  }

  const textChannels = channels.filter(ch => ch.type === 'text')
  const voiceChannels = channels.filter(ch => ch.type === 'voice')
  const categories = channels.filter(ch => ch.type === 'category')

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-discord-elevated">
        <h3 className="text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
          Channels
        </h3>
        {canManageChannels && (
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onChannelCreate}
            className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary"
            title="Create channel"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Button>
        )}
      </div>

      {/* Channel list */}
      <div className="py-2">
        {/* Categories */}
        {categories.map(renderCategory)}

        {/* Text channels */}
        {textChannels.length > 0 && (
          <div className="mb-2">
            <div className="px-3 py-1 text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
              Text Channels
            </div>
            <div className="space-y-0.5">
              {textChannels.map(renderChannel)}
            </div>
          </div>
        )}

        {/* Voice channels */}
        {voiceChannels.length > 0 && (
          <div className="mb-2">
            <div className="px-3 py-1 text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
              Voice Channels
            </div>
            <div className="space-y-0.5">
              {voiceChannels.map(renderChannel)}
            </div>
          </div>
        )}
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div className="fixed inset-0 z-50" onClick={closeContextMenu}>
          <div className="absolute bg-discord-background-primary border border-discord-elevated rounded-md shadow-lg py-1 min-w-[160px]">
            {canManageChannels && (
              <>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-discord-text-primary hover:bg-discord-secondary transition-colors"
                  onClick={() => {
                    onChannelEdit?.(showContextMenu)
                    closeContextMenu()
                  }}
                >
                  Edit Channel
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-discord-accent-red hover:bg-discord-secondary transition-colors"
                  onClick={() => {
                    onChannelDelete?.(showContextMenu)
                    closeContextMenu()
                  }}
                >
                  Delete Channel
                </button>
                <div className="border-t border-discord-elevated my-1" />
              </>
            )}
            <button
              className="w-full px-3 py-2 text-left text-sm text-discord-text-primary hover:bg-discord-secondary transition-colors"
              onClick={() => {
                onChannelSelect?.(showContextMenu)
                closeContextMenu()
              }}
            >
              Join Channel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChannelList
