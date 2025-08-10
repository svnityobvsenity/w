import { supabase } from './supabaseClient'
import { Ticket, Message, User } from './types'

export interface TicketWithDetails extends Ticket {
  user: User
  staff_assigned_user?: User
  messages: Message[]
}

export class TicketService {
  async getTickets(): Promise<TicketWithDetails[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:users(*),
        staff_assigned_user:users!staff_assigned(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getTicket(ticketId: string): Promise<TicketWithDetails | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:users(*),
        staff_assigned_user:users!staff_assigned(*)
      `)
      .eq('id', ticketId)
      .single()

    if (error) throw error
    return data
  }

  async getUserTickets(userId: string): Promise<TicketWithDetails[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:users(*),
        staff_assigned_user:users!staff_assigned(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createTicket(userId: string, title: string, initialMessage: string): Promise<Ticket> {
    // Create a private channel for the ticket
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .insert({
        name: `ticket-${title}`,
        type: 'ticket',
        is_private: true,
        member_count: 1
      })
      .select()
      .single()

    if (channelError) throw channelError

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        user_id: userId,
        title,
        status: 'open',
        channel_id: channel.id
      })
      .select()
      .single()

    if (ticketError) throw ticketError

    // Add user to channel
    const { error: memberError } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channel.id,
        user_id: userId
      })

    if (memberError) throw memberError

    // Create initial message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        channel_id: channel.id,
        user_id: userId,
        content: initialMessage,
        attachments: [],
        reactions: []
      })

    if (messageError) throw messageError

    return ticket
  }

  async updateTicketStatus(ticketId: string, status: 'open' | 'closed' | 'pending'): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async assignStaffToTicket(ticketId: string, staffId: string): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        staff_assigned: staffId,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async addMessageToTicket(ticketId: string, userId: string, content: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: `ticket_${ticketId}`,
        user_id: userId,
        content,
        attachments: [],
        reactions: []
      })
      .select()
      .single()

    if (error) throw error

    // Update ticket's updated_at timestamp
    await supabase
      .from('tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId)

    return data
  }

  async getTicketMessages(ticketId: string): Promise<Message[]> {
    // First get the ticket to find its channel_id
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('channel_id')
      .eq('id', ticketId)
      .single()

    if (ticketError) throw ticketError
    if (!ticket?.channel_id) return []

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', ticket.channel_id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  async closeTicket(ticketId: string): Promise<Ticket> {
    return this.updateTicketStatus(ticketId, 'closed')
  }

  async reopenTicket(ticketId: string): Promise<Ticket> {
    return this.updateTicketStatus(ticketId, 'open')
  }

  async deleteTicket(ticketId: string): Promise<void> {
    // Delete all messages first
    await supabase
      .from('messages')
      .delete()
      .eq('channel_id', `ticket_${ticketId}`)

    // Delete the ticket
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)

    if (error) throw error
  }

  async getTicketStats(): Promise<{
    total: number
    open: number
    closed: number
    pending: number
  }> {
    const { data, error } = await supabase
      .from('tickets')
      .select('status')

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      open: data?.filter(t => t.status === 'open').length || 0,
      closed: data?.filter(t => t.status === 'closed').length || 0,
      pending: data?.filter(t => t.status === 'pending').length || 0
    }

    return stats
  }
}

export const ticketService = new TicketService()
