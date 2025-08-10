import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Stub implementation - returns mock messages
  const mockMessages = [
    {
      id: 'msg-1',
      content: 'Welcome to the chat!',
      channel_id: 'general',
      user_id: 'user-1',
      user: {
        id: 'user-1',
        display_name: 'System',
        username: 'system',
        avatar_url: undefined,
        role: 'admin',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'msg-2',
      content: 'This is a mock message for testing.',
      channel_id: 'general',
      user_id: 'user-2',
      user: {
        id: 'user-2',
        display_name: 'Test User',
        username: 'testuser',
        avatar_url: undefined,
        role: 'user',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]

  return NextResponse.json({
    success: true,
    data: mockMessages,
    message: 'Messages endpoint - using mock data'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Stub implementation - returns mock created message
    const mockMessage = {
      id: `msg-${Date.now()}`,
      content: body.content || 'Mock message content',
      channel_id: body.channel_id || 'general',
      user_id: body.user_id || 'mock-user',
      user: {
        id: body.user_id || 'mock-user',
        display_name: 'Mock User',
        username: 'mockuser',
        avatar_url: undefined,
        role: 'user',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockMessage,
      message: 'Message created successfully (mock)'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create message',
      message: 'Messages POST endpoint - using mock data'
    }, { status: 400 })
  }
}
