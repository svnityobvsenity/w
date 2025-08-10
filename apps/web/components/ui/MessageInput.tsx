import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from './Button'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
  className
}) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2 p-4 border-t border-discord-elevated', className)}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-3 py-2 bg-discord-secondary border border-discord-elevated rounded-md text-discord-text-primary placeholder:text-discord-text-secondary focus:outline-none focus:ring-2 focus:ring-discord-accent-blue focus:border-transparent disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="icon"
        className="flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
