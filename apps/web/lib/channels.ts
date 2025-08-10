import { supabase } from './supabaseClient'
import { Channel, User } from './types'

export interface ChannelWithMembers extends Channel {
  members: User[]
}

export class ChannelService {
  private subscriptions: Map<string, any> = new Map()

  async getChannels(): Promise<Channel[]> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', channelId)
      .single()

    if (error) throw error
    return data
  }

  async createChannel(name: string, type: 'text' | 'voice' | 'ticket', isPrivate: boolean = false): Promise<Channel> {
    const { data, error } = await supabase
      .from('channels')
      .insert({
        name,
        type,
        is_private: isPrivate,
        member_count: 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateChannel(channelId: string, updates: Partial<Channel>): Promise<Channel> {
    const { data, error } = await supabase
      .from('channels')
      .update(updates)
      .eq('id', channelId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteChannel(channelId: string): Promise<void> {
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId)

    if (error) throw error
  }

  async getChannelMembers(channelId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('channel_members')
      .select(`
        user:users(*)
      `)
      .eq('channel_id', channelId)

    if (error) throw error
    return data?.map(item => item.user) || []
  }

  async addMemberToChannel(channelId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channelId,
        user_id: userId
      })

    if (error) throw error

    // Update member count
    await this.updateChannelMemberCount(channelId)
  }

  async removeMemberFromChannel(channelId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId)

    if (error) throw error

    // Update member count
    await this.updateChannelMemberCount(channelId)
  }

  private async updateChannelMemberCount(channelId: string): Promise<void> {
    const { count } = await supabase
      .from('channel_members')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channelId)

    await supabase
      .from('channels')
      .update({ member_count: count || 0 })
      .eq('id', channelId)
  }

  subscribeToChannels(callback: (channel: Channel) => void) {
    const subscription = supabase
      .channel('channels')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels'
        },
        (payload) => {
          callback(payload.new as Channel)
        }
      )
      .subscribe()

    this.subscriptions.set('channels', subscription)
    return subscription
  }

  unsubscribeFromChannels() {
    const subscription = this.subscriptions.get('channels')
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete('channels')
    }
  }
}

export const channelService = new ChannelService()
