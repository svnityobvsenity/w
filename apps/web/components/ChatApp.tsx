'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/auth'
import { useAppStore } from '@/lib/store'
import { Channel, Message } from '@fride/types'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import VoiceControls from './VoiceControls'
import AdminDashboard from './AdminDashboard'
import { supabase } from '@/lib/supabaseClient'

export default function ChatApp() {
  const { user, signOut } = useAuthStore()
  const { setActiveChannel, activeChannel } = useAppStore()
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [selectedDM, setSelectedDM] = useState<string | null>(null)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch channels on component mount
  useEffect(() => {
    fetchChannels()
  }, [])

  // Fetch messages when channel changes
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel)
    }
  }, [selectedChannel])

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching channels:', error)
      } else {
        setChannels(data || [])
        // Set initial channel if none selected
        if (data && data.length > 0 && !selectedChannel) {
          const generalChannel = data.find(ch => ch.name === 'general') || data[0]
          setSelectedChannel(generalChannel.id)
          setActiveChannel(generalChannel.id)
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          users:user_id (
            id,
            display_name,
            username,
            avatar_url
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedChannel || !user) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          channel_id: selectedChannel,
          content,
          user_id: user.id,
        })
        .select(`
          *,
          users:user_id (
            id,
            display_name,
            username,
            avatar_url
          )
        `)
        .single()

      if (error) {
        console.error('Error sending message:', error)
      } else {
        // Add new message to the list
        setMessages(prev => [...prev, data])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId)
    setSelectedDM(null)
    setActiveChannel(channelId)
  }

  const handleDMSelect = (userId: string) => {
    setSelectedDM(userId)
    setSelectedChannel(null)
    setActiveChannel(null) // DMs don't use the same store
  }

  const handleAdminClick = () => {
    setShowAdminDashboard(true)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading channels...</p>
        </div>
      </div>
    )
  }

  const currentChannel = channels.find(ch => ch.id === selectedChannel) || null

  return (
    <div className="h-screen flex bg-background-primary">
      {/* Left Sidebar */}
      <Sidebar
        channels={channels}
        user={user}
        onChannelSelect={handleChannelSelect}
        activeChannelId={selectedChannel}
        onSignOut={handleSignOut}
        onAdminClick={handleAdminClick}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {showAdminDashboard ? (
          <AdminDashboard user={user} onBack={() => setShowAdminDashboard(false)} />
        ) : (
          <>
            <ChatArea
              channel={currentChannel}
              messages={messages}
              user={user}
              onSendMessage={handleSendMessage}
            />
            
            {/* Voice Controls */}
            <VoiceControls user={user} />
          </>
        )}
      </div>
    </div>
  )
}
