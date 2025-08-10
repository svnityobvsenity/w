export interface User {
  id: string
  email: string
  username: string
  display_name: string
  discriminator: string
  avatar_url?: string
  status: 'online' | 'offline' | 'away' | 'dnd'
  role: 'user' | 'moderator' | 'admin'
  is_online: boolean
  created_at: string
  updated_at: string
}

export interface Channel {
  id: string
  name: string
  description?: string
  type: 'text' | 'voice' | 'ticket'
  is_private: boolean
  member_count?: number
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  channel_id: string
  user_id: string
  user: User
  reply_to_id?: string
  reply_to_message?: Message
  attachments?: string[]
  reactions?: any[]
  edited_at?: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
  color: string
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  role: Role
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  status: 'open' | 'pending' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  user_id: string
  user: User
  staff_assigned?: string
  staff_assigned_user?: User
  channel_id: string
  created_at: string
  updated_at: string
}

export interface VoiceParticipant {
  user_id: string
  is_muted: boolean
  is_deafened: boolean
  speaking: boolean
  volume: number
}

export interface VoiceRoom {
  id: string
  channel_id: string
  participants: VoiceParticipant[]
  created_at: string
}

export interface VoiceConnection {
  id: string
  channel_id: string
  user_id: string
  user: User
  is_muted: boolean
  is_deafened: boolean
  is_speaking: boolean
  joined_at: string
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
}

export interface AppState {
  activeChannel: string | null
  channels: Channel[]
  messages: Record<string, Message[]>
  tickets: Ticket[]
  voiceConnections: VoiceConnection[]
  sidebarCollapsed: boolean
  theme: 'dark' | 'light'
}

export interface BroadcastMessage {
  type: 'auth:login' | 'auth:logout' | 'channel:switch' | 'message:new' | 'voice:join' | 'voice:leave'
  payload: any
  timestamp: number
}

