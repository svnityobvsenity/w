import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Stub implementation - returns mock auth data
  return NextResponse.json({
    success: true,
    message: 'Auth callback endpoint - not implemented yet',
    data: {
      user: {
        id: 'mock-user-id',
        email: 'mock@example.com',
        username: 'mockuser',
        display_name: 'Mock User',
        role: 'user',
        is_online: true,
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000,
      }
    }
  })
}

export async function POST(request: Request) {
  // Stub implementation for POST requests
  return NextResponse.json({
    success: true,
    message: 'Auth callback POST endpoint - not implemented yet',
    data: null
  })
}
