import { supabase } from './supabaseClient'
import { Message, User } from './types'

export interface MessageWithUser extends Message {
  user: User
}

export class MessageService {
  private subscriptions: Map<string, any> = new Map()

  async getMessages(channelId: string): Promise<MessageWithUser[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:users(*)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  async sendMessage(channelId: string, content: string, userId: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: userId,
        content,
        attachments: [],
        reactions: []
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  subscribeToMessages(channelId: string, callback: (message: MessageWithUser) => void) {
    // Unsubscribe from previous subscription if exists
    if (this.subscriptions.has(channelId)) {
      this.subscriptions.get(channelId)?.unsubscribe()
    }

    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const message = payload.new as Message
          // Fetch user data for the message
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', message.user_id)
            .single()
          
          if (user) {
            callback({ ...message, user })
          }
        }
      )
      .subscribe()

    this.subscriptions.set(channelId, subscription)
    return subscription
  }

  unsubscribeFromMessages(channelId: string) {
    const subscription = this.subscriptions.get(channelId)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(channelId)
    }
  }

  async updateMessage(messageId: string, content: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .update({ 
        content,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error
  }

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    // Get current reactions
    const { data: message } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single()

    if (!message) return

    const reactions = message.reactions || []
    const existingReaction = reactions.find(r => r.emoji === emoji)
    
    if (existingReaction) {
      if (existingReaction.users.includes(userId)) {
        // Remove user from reaction
        existingReaction.users = existingReaction.users.filter(id => id !== userId)
        existingReaction.count = Math.max(0, existingReaction.count - 1)
      } else {
        // Add user to reaction
        existingReaction.users.push(userId)
        existingReaction.count += 1
      }
    } else {
      // Create new reaction
      reactions.push({
        emoji,
        count: 1,
        users: [userId]
      })
    }

    // Update message with new reactions
    await supabase
      .from('messages')
      .update({ reactions })
      .eq('id', messageId)
  }
}

export const messageService = new MessageService()
