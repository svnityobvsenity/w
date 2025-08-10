import { create } from 'zustand'
import { supabase } from './supabaseClient'
import { User } from './types'

interface AuthState {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  signUp: async (email: string, password: string, displayName: string, username: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            display_name: displayName,
            username,
            discriminator: Math.floor(Math.random() * 9000 + 1000).toString(),
            role: 'user',
          })

        if (profileError) throw profileError

        // Fetch the created user
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userData) {
          set({ user: userData })
        }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Fetch user profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userData) {
          set({ user: userData })
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  setUser: (user: User | null) => set({ user }),
}))

// Initialize auth state
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      // Fetch user profile
      supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data: userData }) => {
          if (userData) {
            useAuthStore.getState().setUser(userData)
          }
        })
    }
    useAuthStore.setState({ isLoading: false })
  })

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userData) {
        useAuthStore.getState().setUser(userData)
      }
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null)
    }
  })
}
