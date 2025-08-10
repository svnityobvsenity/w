import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Stub implementation - returns mock voice connections
  const mockVoiceConnections = [
    {
      id: 'voice-1',
      channel_id: 'voice-general',
      user_id: 'user-1',
      user: {
        id: 'user-1',
        display_name: 'Voice User 1',
        username: 'voiceuser1',
        avatar_url: undefined,
        role: 'user',
      },
      is_muted: false,
      is_deafened: false,
      is_speaking: false,
      joined_at: new Date().toISOString(),
    }
  ]

  return NextResponse.json({
    success: true,
    data: mockVoiceConnections,
    message: 'Voice endpoint - using mock data'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Stub implementation - returns mock voice connection
    const mockConnection = {
      id: `voice-${Date.now()}`,
      channel_id: body.channel_id || 'voice-general',
      user_id: body.user_id || 'mock-user',
      user: {
        id: body.user_id || 'mock-user',
        display_name: 'Mock Voice User',
        username: 'mockvoiceuser',
        avatar_url: undefined,
        role: 'user',
      },
      is_muted: body.is_muted || false,
      is_deafened: body.is_deafened || false,
      is_speaking: body.is_speaking || false,
      joined_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockConnection,
      message: 'Voice connection created successfully (mock)'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create voice connection',
      message: 'Voice POST endpoint - using mock data'
    }, { status: 400 })
  }
}
