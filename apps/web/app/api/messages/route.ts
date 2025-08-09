import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get('channelId')
  
  if (!channelId) {
    return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: messages, error } = await supabase
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { channel_id, content, attachments } = await request.json()

  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      channel_id,
      content,
      user_id: user.id,
      attachments: attachments || [],
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(message)
}
