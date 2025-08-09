import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import Button from './Button'

export interface MessageComposerProps {
  placeholder?: string
  onSend?: (message: string, replyToId?: string) => void
  onTyping?: (isTyping: boolean) => void
  replyTo?: {
    id: string
    author: string
    content: string
  }
  onCancelReply?: () => void
  disabled?: boolean
  className?: string
  maxLength?: number
  showAttachments?: boolean
  showEmoji?: boolean
  showGif?: boolean
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  placeholder = 'Message...',
  onSend,
  onTyping,
  replyTo,
  onCancelReply,
  disabled = false,
  className,
  maxLength = 2000,
  showAttachments = true,
  showEmoji = true,
  showGif = false,
}) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [replyTo])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    
    // Handle typing indicator
    if (value.length > 0 && !isTyping) {
      setIsTyping(true)
      onTyping?.(true)
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false)
      onTyping?.(false)
    }

    // Clear typing indicator after delay
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onTyping?.(false)
    }, 1000)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && onSend) {
      onSend(trimmedMessage, replyTo?.id)
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleCancelReply = () => {
    onCancelReply?.()
  }

  const isMessageValid = message.trim().length > 0 && message.length <= maxLength

  return (
    <div className={cn('w-full', className)}>
      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-discord-secondary border-l-4 border-discord-accent-blue rounded-t">
          <div className="flex items-center space-x-2">
            <div className="w-0.5 h-4 bg-discord-accent-blue rounded-full" />
            <span className="text-sm text-discord-text-muted">
              Replying to <span className="text-discord-text-primary font-medium">{replyTo.author}</span>
            </span>
          </div>
          <button
            onClick={handleCancelReply}
            className="text-discord-text-muted hover:text-discord-text-primary transition-colors"
            title="Cancel reply"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Message input area */}
      <div className="flex items-end space-x-2 p-3 bg-discord-secondary rounded-b border border-discord-elevated">
        {/* Left side controls */}
        <div className="flex items-center space-x-1">
          {showAttachments && (
            <Button
              variant="ghost"
              size="iconSm"
              className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary"
              title="Add attachment"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
          )}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              'w-full min-h-[44px] max-h-[120px] px-3 py-2 bg-discord-tertiary border border-discord-elevated rounded-md text-discord-text-primary placeholder:text-discord-text-muted resize-none focus:outline-none focus:border-discord-accent-blue transition-colors',
              'scrollbar-thin scrollbar-thumb-discord-elevated scrollbar-track-transparent'
            )}
            style={{ height: '44px' }}
          />
          
          {/* Character count */}
          {message.length > maxLength * 0.8 && (
            <div className="absolute bottom-1 right-2 text-xs text-discord-text-muted">
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-1">
          {showGif && (
            <Button
              variant="ghost"
              size="iconSm"
              className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary"
              title="GIF"
            >
              <span className="text-xs font-bold">GIF</span>
            </Button>
          )}
          
          {showEmoji && (
            <Button
              variant="ghost"
              size="iconSm"
              className="text-discord-text-muted hover:text-discord-text-primary hover:bg-discord-tertiary"
              title="Add emoji"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415zM9 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Button>
          )}

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!isMessageValid || disabled}
            size="iconSm"
            className={cn(
              'transition-all duration-200',
              isMessageValid
                ? 'bg-discord-accent-blue text-white hover:bg-discord-accent-blue/90'
                : 'bg-discord-tertiary text-discord-text-muted cursor-not-allowed'
            )}
            title="Send message"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.25A1 1 0 009 15.25v-6a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1h5a1 1 0 001 1v.25a1 1 0 00.894.591l5-1.25a1 1 0 001.169-1.409l-7-14z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-1 text-xs text-discord-text-muted italic">
          Typing...
        </div>
      )}
    </div>
  )
}

export default MessageComposer
