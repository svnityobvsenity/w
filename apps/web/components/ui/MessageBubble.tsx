import React from 'react'
import { cn } from '../../lib/utils'
import { Message, User } from '../../lib/types'
import { formatTimestamp } from '../../lib/utils'

interface MessageBubbleProps {
  message: Message
  isOwnMessage?: boolean
  showAvatar?: boolean
  className?: string
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage = false,
  showAvatar = true,
  className
}) => {
  return (
    <div className={cn(
      'flex gap-3 p-2 hover:bg-discord-secondary/50 rounded-md transition-colors',
      isOwnMessage && 'flex-row-reverse',
      className
    )}>
      {showAvatar && (
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full bg-discord-accent-blue flex items-center justify-center text-white text-sm font-medium',
          isOwnMessage && 'order-2'
        )}>
          {message.user.display_name?.charAt(0) || message.user.username?.charAt(0) || 'U'}
        </div>
      )}
      
      <div className={cn(
        'flex-1 min-w-0',
        isOwnMessage && 'text-right'
      )}>
        <div className={cn(
          'flex items-baseline gap-2 mb-1',
          isOwnMessage && 'justify-end'
        )}>
          <span className="font-medium text-discord-text-primary">
            {message.user.display_name || message.user.username}
          </span>
          <span className="text-xs text-discord-text-secondary">
            {formatTimestamp(message.created_at)}
          </span>
        </div>
        
        <div className={cn(
          'text-discord-text-primary break-words',
          isOwnMessage && 'text-right'
        )}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
