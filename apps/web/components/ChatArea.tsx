'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../lib/auth'
import { MessageBubble } from './ui/MessageBubble'
import { MessageInput } from './ui/MessageInput'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabaseClient'
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel'
import type { Message } from '@/lib/types'

interface ChatAreaProps {
  selectedChannel: string | null
  selectedDM: string | null
  user: any
  className?: string
}

export default function ChatArea({ selectedChannel, selectedDM, user, className }: ChatAreaProps) {
  const {
    activeChannel,
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage
  } = useAppStore()
  
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { broadcastMessage } = useBroadcastChannel()

  // Use selectedChannel if available, otherwise fall back to activeChannel
  const currentChannelId = selectedChannel || activeChannel

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentChannelId])

  // Load messages for active channel
  useEffect(() => {
    if (!currentChannelId) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            user:users(*),
            reply_to_message:messages!reply_to_id(*, user:users(*))
          `)
          .eq('channel_id', currentChannelId)
          .order('created_at', { ascending: true })
          .limit(100)

        if (error) throw error

        const formattedMessages = data.map(msg => ({
          ...msg,
          reply_to_message: msg.reply_to_message ? {
            ...msg.reply_to_message,
            user: msg.reply_to_message.user
          } : undefined
        }))

        setMessages(currentChannelId, formattedMessages)
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [currentChannelId, setMessages])

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!currentChannelId) return

    const channel = supabase
      .channel(`messages:${currentChannelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${currentChannelId}`
        },
        (payload) => {
          const newMessage = payload.new as Message
          // Fetch the full message with user data
          supabase
            .from('users')
            .select('*')
            .eq('id', newMessage.user_id)
            .single()
            .then(({ data: user }) => {
              if (user) {
                const messageWithUser = { ...newMessage, user }
                addMessage(currentChannelId, messageWithUser)
                broadcastMessage('new', messageWithUser)
              }
            })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentChannelId, addMessage, broadcastMessage])

  const handleSendMessage = async (content: string, replyToId?: string) => {
    if (!currentChannelId || !content.trim()) return

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          channel_id: currentChannelId,
          user_id: user.id,
          content: content.trim(),
          reply_to_id: replyToId,
          attachments: [],
          reactions: []
        })
        .select(`
          *,
          user:users(*),
          reply_to_message:messages!reply_to_id(*, user:users(*))
        `)
        .single()

      if (error) throw error

      const formattedMessage = {
        ...message,
        reply_to_message: message.reply_to_message ? {
          ...message.reply_to_message,
          user: message.reply_to_message.user
        } : undefined
      }

      addMessage(currentChannelId, formattedMessage)
      broadcastMessage('new', formattedMessage)
      setReplyToMessage(null)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!currentChannelId) return

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .update({ 
          content: newContent,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select(`
          *,
          user:users(*),
          reply_to_message:messages!reply_to_id(*, user:users(*))
        `)
        .single()

      if (error) throw error

      const formattedMessage = {
        ...message,
        reply_to_message: message.reply_to_message ? {
          ...message.reply_to_message,
          user: message.reply_to_message.user
        } : undefined
      }

      updateMessage(currentChannelId, messageId, formattedMessage)
      broadcastMessage('edit', formattedMessage)
    } catch (error) {
      console.error('Error editing message:', error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentChannelId) return

    try {
      await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      removeMessage(currentChannelId, messageId)
      broadcastMessage('delete', { id: messageId })
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleReply = (message: Message) => {
    setReplyToMessage(message)
  }

  if (!currentChannelId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-secondary mb-2">
            Select a Channel
          </h2>
          <p className="text-text-muted">
            Choose a channel from the sidebar to start chatting
          </p>
        </div>
      </div>
    )
  }

  const currentMessages = messages[currentChannelId] || []

  return (
    <div className={`flex-1 flex flex-col bg-background-primary ${className || ''}`}>
      {/* Channel Header */}
      <div className="h-14 bg-background-secondary border-b border-background-quaternary flex items-center px-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg text-text-muted">#</span>
          <h2 className="text-lg font-semibold text-text-primary">
            {selectedChannel ? `Channel ${selectedChannel}` : 'Direct Message'}
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-text-muted">Loading messages...</p>
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-muted">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          currentMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.user_id === user.id}
              showAvatar={true}
              showTimestamp={true}
              onEdit={(newContent) => handleEditMessage(message.id, newContent)}
              onDelete={() => handleDeleteMessage(message.id)}
              onReply={() => handleReply(message)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-background-quaternary">
        <MessageInput
          onSend={(content) => handleSendMessage(content, replyToMessage?.id)}
          replyToMessage={replyToMessage ? {
            id: replyToMessage.id,
            content: replyToMessage.content,
            username: replyToMessage.user.display_name
          } : null}
          onCancelReply={() => setReplyToMessage(null)}
          placeholder={replyToMessage ? `Reply to ${replyToMessage.user.display_name}...` : 'Type a message...'}
          disabled={false}
        />
      </div>
    </div>
  )
}

