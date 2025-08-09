import { supabase } from './supabaseClient'
import { User, Role } from '@fride/types'

export class UserService {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('display_name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateUserPresence(userId: string, isOnline: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        is_online: isOnline,
        last_seen: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error
  }

  async getOnlineUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_online', true)
      .order('display_name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createRole(name: string, color: string, permissions: string[]): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .insert({
        name,
        color,
        permissions
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .update(updates)
      .eq('id', roleId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteRole(roleId: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (error) throw error
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role: roleId })
      .eq('id', userId)

    if (error) throw error
  }

  async removeRoleFromUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role: 'user' })
      .eq('id', userId)

    if (error) throw error
  }

  subscribeToUserPresence(callback: (user: User) => void) {
    const subscription = supabase
      .channel('user_presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          callback(payload.new as User)
        }
      )
      .subscribe()

    return subscription
  }

  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(10)

    if (error) throw error
    return data || []
  }
}

export const userService = new UserService()
