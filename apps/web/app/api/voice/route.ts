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
  
  const { data: voiceRoom, error } = await supabase
    .from('voice_rooms')
    .select(`
      *,
      participants:voice_participants (
        *,
        users:user_id (
          id,
          display_name,
          username,
          avatar_url
        )
      )
    `)
    .eq('channel_id', channelId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(voiceRoom || null)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { channel_id, user_id } = await request.json()

  // Check if voice room exists
  let { data: voiceRoom } = await supabase
    .from('voice_rooms')
    .select('*')
    .eq('channel_id', channel_id)
    .single()

  if (!voiceRoom) {
    // Create new voice room
    const { data: newRoom, error: roomError } = await supabase
      .from('voice_rooms')
      .insert({ channel_id })
      .select()
      .single()

    if (roomError) {
      return NextResponse.json({ error: roomError.message }, { status: 500 })
    }
    voiceRoom = newRoom
  }

  // Add user to voice room
  const { data: participant, error } = await supabase
    .from('voice_participants')
    .upsert({
      voice_room_id: voiceRoom.id,
      user_id,
      is_muted: false,
      is_deafened: false,
      speaking: false,
      volume: 100,
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

  return NextResponse.json(participant)
}
