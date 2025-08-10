import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { supabase } from './supabaseClient'
import type { User, Channel, Message, Ticket, VoiceConnection, AppState, AuthState } from './types'

interface AppStore extends AppState {
  // Auth actions
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  setAuthLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  loadUserProfile: (userId: string) => Promise<void>
  
  // Channel actions
  setChannels: (channels: Channel[]) => void
  addChannel: (channel: Channel) => void
  updateChannel: (channelId: string, updates: Partial<Channel>) => void
  removeChannel: (channelId: string) => void
  setActiveChannel: (channelId: string | null) => void
  
  // Message actions
  setMessages: (channelId: string, messages: Message[]) => void
  addMessage: (channelId: string, message: Message) => void
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void
  removeMessage: (channelId: string, messageId: string) => void
  
  // Ticket actions
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  
  // Voice actions
  setVoiceConnections: (connections: VoiceConnection[]) => void
  addVoiceConnection: (connection: VoiceConnection) => void
  removeVoiceConnection: (connectionId: string) => void
  updateVoiceConnection: (connectionId: string, updates: Partial<VoiceConnection>) => void
  
  // UI actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
  
  // Initialize store
  initialize: () => Promise<void>
}

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    session: null,
    loading: true,
    activeChannel: null,
    channels: [],
    messages: {},
    tickets: [],
    voiceConnections: [],
    sidebarCollapsed: false,
    theme: 'dark',
    
    // Auth actions
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setAuthLoading: (loading) => set({ loading }),
    
    signOut: async () => {
      await supabase.auth.signOut()
      set({ 
        user: null, 
        session: null, 
        activeChannel: null,
        messages: {},
        tickets: [],
        voiceConnections: []
      })
    },
    
    // Channel actions
    setChannels: (channels) => set({ channels }),
    addChannel: (channel) => set((state) => ({ 
      channels: [...state.channels, channel] 
    })),
    updateChannel: (channelId, updates) => set((state) => ({
      channels: state.channels.map(ch => 
        ch.id === channelId ? { ...ch, ...updates } : ch
      )
    })),
    removeChannel: (channelId) => set((state) => ({
      channels: state.channels.filter(ch => ch.id !== channelId)
    })),
    setActiveChannel: (channelId) => set({ activeChannel: channelId }),
    
    // Message actions
    setMessages: (channelId, messages) => set((state) => ({
      messages: { ...state.messages, [channelId]: messages }
    })),
    addMessage: (channelId, message) => set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), message]
      }
    })),
    updateMessage: (channelId, messageId, updates) => set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      }
    })),
    removeMessage: (channelId, messageId) => set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).filter(msg => 
          msg.id !== messageId
        )
      }
    })),
    
    // Ticket actions
    setTickets: (tickets) => set({ tickets }),
    addTicket: (ticket) => set((state) => ({ 
      tickets: [...state.tickets, ticket] 
    })),
    updateTicket: (ticketId, updates) => set((state) => ({
      tickets: state.tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    })),
    
    // Voice actions
    setVoiceConnections: (connections) => set({ voiceConnections: connections }),
    addVoiceConnection: (connection) => set((state) => ({
      voiceConnections: [...state.voiceConnections, connection]
    })),
    removeVoiceConnection: (connectionId) => set((state) => ({
      voiceConnections: state.voiceConnections.filter(conn => 
        conn.id !== connectionId
      )
    })),
    updateVoiceConnection: (connectionId, updates) => set((state) => ({
      voiceConnections: state.voiceConnections.map(conn =>
        conn.id === connectionId ? { ...conn, ...updates } : conn
      )
    })),
    
    // UI actions
    toggleSidebar: () => set((state) => ({ 
      sidebarCollapsed: !state.sidebarCollapsed 
    })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setTheme: (theme) => set({ theme }),
    
    // Initialize store
    initialize: async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          get().setSession(session)
          await get().loadUserProfile(session.user.id)
        }
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            get().setSession(session)
            await get().loadUserProfile(session.user.id)
          } else if (event === 'SIGNED_OUT') {
            get().setSession(null)
            get().setUser(null)
          }
        })
        
        get().setAuthLoading(false)
      } catch (error) {
        console.error('Failed to initialize store:', error)
        get().setAuthLoading(false)
      }
    },
    
    // Helper method to load user profile
    loadUserProfile: async (userId: string) => {
      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error) throw error
        get().setUser(user)
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    }
  }))
)

// Subscribe to store changes for persistence
useAppStore.subscribe(
  (state) => ({ user: state.user, theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
  (state) => {
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('fride-theme', state.theme)
      localStorage.setItem('fride-sidebar-collapsed', String(state.sidebarCollapsed))
    }
  }
)

// Load persisted state on mount
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('fride-theme') as 'dark' | 'light' | null
  const sidebarCollapsed = localStorage.getItem('fride-sidebar-collapsed') === 'true'
  
  if (theme) useAppStore.getState().setTheme(theme)
  if (sidebarCollapsed) useAppStore.getState().setSidebarCollapsed(true)
}
