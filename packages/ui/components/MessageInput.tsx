import React, { useState, useRef, useEffect } from 'react'
import { Send, Smile, Paperclip, AtSign } from 'lucide-react'
import { Button } from './Button'
import { IconButton } from './IconButton'
import { cn } from '../lib/utils'

interface MessageInputProps {
  onSend: (content: string, replyToId?: string) => void
  replyToMessage?: {
    id: string
    content: string
    username: string
  } | null
  onCancelReply?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MessageInput({
  onSend,
  replyToMessage,
  onCancelReply,
  placeholder = "Message #channel",
  disabled = false,
  className
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const canSend = content.trim().length > 0 && !disabled
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    
    const messageContent = content.trim()
    onSend(messageContent, replyToMessage?.id)
    setContent('')
    setIsComposing(false)
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
    
    if (e.key === 'Escape' && replyToMessage) {
      onCancelReply?.()
    }
  }
  
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setContent(target.value)
    
    // Auto-resize textarea
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`
  }
  
  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)
  
  return (
    <div className={cn('border-t border-background-quaternary bg-background-primary', className)}>
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-tertiary/50 border-b border-background-quaternary">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Replying to</span>
            <span className="text-accent-primary font-medium">
              @{replyToMessage.username}
            </span>
            <span className="text-text-secondary truncate max-w-xs">
              {replyToMessage.content}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelReply}
            className="h-6 w-6 p-0 hover:bg-background-quaternary/50"
          >
            ×
          </Button>
        </div>
      )}
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full min-h-[44px] max-h-[120px] px-3 py-2 bg-background-tertiary border border-background-quaternary rounded-md text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              rows={1}
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <IconButton
                size="sm"
                variant="ghost"
                type="button"
                className="h-6 w-6 p-0 hover:bg-background-quaternary/50 text-text-muted hover:text-text-primary"
                title="Emoji"
              >
                <Smile className="h-4 w-4" />
              </IconButton>
              
              <IconButton
                size="sm"
                variant="ghost"
                type="button"
                className="h-6 w-6 p-0 hover:bg-background-quaternary/50 text-text-muted hover:text-text-primary"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </IconButton>
              
              <IconButton
                size="sm"
                variant="ghost"
                type="button"
                className="h-6 w-6 p-0 hover:bg-background-quaternary/50 text-text-muted hover:text-text-primary"
                title="Mention user"
              >
                <AtSign className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!canSend || isComposing}
            className="h-[44px] px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Character Count */}
        <div className="mt-2 text-xs text-text-muted text-right">
          {content.length}/2000
        </div>
      </form>
    </div>
  )
}
