export interface User {
  id: string
  email: string
  display_name: string
  username: string
  discriminator: string
  avatar_url?: string
  banner_url?: string
  role: 'user' | 'admin' | 'moderator'
  created_at: string
  is_online: boolean
  last_seen: string
}

export interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'ticket'
  is_private: boolean
  created_at: string
  last_message_at?: string
  member_count: number
}

export interface Message {
  id: string
  channel_id: string
  user_id: string
  content: string
  attachments: string[]
  edited_at?: string
  created_at: string
  reply_to?: string
  reactions: Reaction[]
}

export interface Reaction {
  emoji: string
  count: number
  users: string[]
}

export interface VoiceRoom {
  id: string
  channel_id: string
  participants: VoiceParticipant[]
  created_at: string
}

export interface VoiceParticipant {
  user_id: string
  is_muted: boolean
  is_deafened: boolean
  speaking: boolean
  volume: number
}

export interface Ticket {
  id: string
  user_id: string
  title: string
  status: 'open' | 'closed' | 'pending'
  staff_assigned?: string
  created_at: string
  updated_at: string
  messages: Message[]
}

export interface Role {
  id: string
  name: string
  color: string
  permissions: string[]
  created_at: string
}
