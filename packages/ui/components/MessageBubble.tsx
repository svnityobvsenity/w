import React from 'react'
import { cn } from '../../lib/utils'
import Avatar from './Avatar'

// Define Message interface locally for now
interface Message {
  id: string
  content: string
  channel_id: string
  user_id: string
  user: {
    id: string
    display_name: string
    avatar_url?: string
    status: 'online' | 'offline' | 'away' | 'dnd'
    role: 'user' | 'moderator' | 'admin'
  }
  reply_to_id?: string
  reply_to_message?: Message
  attachments?: string[]
  reactions?: any[]
  edited_at?: string
  created_at: string
  updated_at: string
}

export interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  onEdit?: (newContent: string) => void
  onDelete?: () => void
  onReply?: () => void
  className?: string
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onEdit,
  onDelete,
  onReply,
  className,
}) => {
  const [showActions, setShowActions] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(message.content)
  const editInputRef = React.useRef<HTMLTextAreaElement>(null)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(message.content)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div className={cn('group relative px-4 py-1', className)}>
        <div className="flex items-start space-x-3">
          {showAvatar && (
            <Avatar
              src={message.user.avatar_url}
              fallback={message.user.display_name}
              size="sm"
              status={message.user.status}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-text-primary">
                {message.user.display_name}
              </span>
              {showTimestamp && (
                <span className="text-xs text-text-muted">
                  {formatTimestamp(message.created_at)}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <textarea
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 text-sm bg-background-secondary border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary"
                rows={Math.max(1, editContent.split('\n').length)}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs bg-background-tertiary text-text-secondary rounded-md hover:bg-background-quaternary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'group relative px-4 py-1 hover:bg-background-secondary/50 transition-colors',
        message.reply_to_message && 'ml-8',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Reply indicator */}
      {message.reply_to_message && (
        <div className="flex items-center space-x-2 mb-2 ml-12">
          <div className="w-0.5 h-4 bg-text-muted rounded-full" />
          <span className="text-xs text-text-muted">
            Replying to <span className="text-accent-primary">{message.reply_to_message.user.display_name}</span>
          </span>
        </div>
      )}

      <div className="flex items-start space-x-3">
        {showAvatar && (
          <Avatar
            src={message.user.avatar_url}
            fallback={message.user.display_name}
            size="sm"
            status={message.user.status}
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-text-primary">
              {message.user.display_name}
            </span>
            {showTimestamp && (
              <span className="text-xs text-text-muted">
                {formatTimestamp(message.created_at)}
              </span>
            )}
            {message.edited_at && (
              <span className="text-xs text-text-muted">(edited)</span>
            )}
          </div>
          
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="max-w-md">
                  <div className="flex items-center space-x-2 p-2 bg-background-tertiary rounded border border-border">
                    <div className="w-8 h-8 bg-accent-primary rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {attachment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {message.reactions.map((reaction: any, index) => (
                <button
                  key={`${reaction.emoji}-${index}`}
                  className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-background-tertiary text-text-secondary hover:bg-background-quaternary transition-colors"
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-medium">{reaction.count || 1}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message actions */}
      {showActions && (isOwn || message.user.role === 'admin' || message.user.role === 'moderator') && (
        <div className="absolute right-2 top-2 flex items-center space-x-1 bg-background-primary rounded border border-border p-1 shadow-lg">
          {isOwn && onEdit && (
            <button
              onClick={handleEdit}
              className="p-1 text-text-muted hover:text-text-primary hover:bg-background-secondary rounded transition-colors"
              title="Edit message"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          
          {(isOwn || message.user.role === 'admin' || message.user.role === 'moderator') && onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-text-muted hover:text-accent-red hover:bg-background-secondary rounded transition-colors"
              title="Delete message"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <button
            onClick={onReply}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-background-secondary rounded transition-colors"
            title="Reply to message"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default MessageBubble
