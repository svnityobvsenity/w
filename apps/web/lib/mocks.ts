// Mock file for missing imports and dependencies
// This file provides placeholder implementations for any missing modules

// Mock for @fride/types if not available
export const mockTypes = {
  User: {
    id: 'mock-user-id',
    email: 'mock@example.com',
    username: 'mockuser',
    display_name: 'Mock User',
    discriminator: '0001',
    avatar_url: undefined,
    status: 'online' as const,
    role: 'user' as const,
    is_online: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  Channel: {
    id: 'mock-channel-id',
    name: 'general',
    description: 'General discussion',
    type: 'text' as const,
    is_private: false,
    member_count: 1,
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  Message: {
    id: 'mock-message-id',
    content: 'Mock message content',
    channel_id: 'mock-channel-id',
    user_id: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com',
      username: 'mockuser',
      display_name: 'Mock User',
      discriminator: '0001',
      avatar_url: undefined,
      status: 'online' as const,
      role: 'user' as const,
      is_online: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    reply_to_id: undefined,
    reply_to_message: undefined,
    attachments: [],
    reactions: [],
    edited_at: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  Ticket: {
    id: 'mock-ticket-id',
    title: 'Mock Ticket',
    status: 'open' as const,
    priority: 'medium' as const,
    user_id: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com',
      username: 'mockuser',
      display_name: 'Mock User',
      discriminator: '0001',
      avatar_url: undefined,
      status: 'online' as const,
      role: 'user' as const,
      is_online: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    staff_assigned: undefined,
    staff_assigned_user: undefined,
    channel_id: 'mock-channel-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  VoiceConnection: {
    id: 'mock-voice-id',
    channel_id: 'mock-channel-id',
    user_id: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com',
      username: 'mockuser',
      display_name: 'Mock User',
      discriminator: '0001',
      avatar_url: undefined,
      status: 'online' as const,
      role: 'user' as const,
      is_online: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_muted: false,
    is_deafened: false,
    is_speaking: false,
    joined_at: new Date().toISOString(),
  },
}

// Mock for missing modules
export const mockModules = {
  'ws': {
    WebSocket: class MockWebSocket {
      constructor() {
        this.readyState = 1; // OPEN
        this.url = 'ws://mock';
      }
      send() {}
      close() {}
      addEventListener() {}
      removeEventListener() {}
    },
    Server: class MockWebSocketServer {
      constructor() {}
      on() {}
      close() {}
    }
  },
  'fs': {
    readFileSync: () => 'mock file content',
    writeFileSync: () => {},
    existsSync: () => true,
    mkdirSync: () => {},
  },
  'path': {
    join: (...args: string[]) => args.join('/'),
    resolve: (...args: string[]) => args.join('/'),
    dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
  },
  'crypto': {
    randomBytes: (size: number) => Buffer.alloc(size),
    createHash: () => ({
      update: () => ({ digest: () => 'mock-hash' }),
    }),
  },
}

// Mock for environment variables
export const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'mock-secret',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock',
  NEXT_PUBLIC_SIGNALING_SERVER_URL: process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || 'ws://localhost:3001',
  SIGNALING_SERVER_PORT: process.env.SIGNALING_SERVER_PORT || '3001',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  NEXT_PUBLIC_ENABLE_VOICE: process.env.NEXT_PUBLIC_ENABLE_VOICE || 'true',
  NEXT_PUBLIC_ENABLE_TICKETS: process.env.NEXT_PUBLIC_ENABLE_TICKETS || 'true',
  NEXT_PUBLIC_ENABLE_ADMIN: process.env.NEXT_PUBLIC_ENABLE_ADMIN || 'true',
  NODE_ENV: process.env.NODE_ENV || 'development',
  VERCEL_ENV: process.env.VERCEL_ENV || 'development',
}

// Mock for Supabase client
export const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: mockTypes.User, error: null }),
        order: () => Promise.resolve({ data: [mockTypes.User], error: null }),
      }),
      insert: () => Promise.resolve({ data: mockTypes.User, error: null }),
      update: () => Promise.resolve({ data: mockTypes.User, error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
  }),
  auth: {
    signUp: () => Promise.resolve({ data: { user: mockTypes.User }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: mockTypes.User }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: mockTypes.User }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock auth state change listener
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
  },
  channel: () => ({
    on: () => ({
      subscribe: () => Promise.resolve({ data: { subscription: { unsubscribe: () => {} } } }),
    }),
  }),
  removeChannel: () => {},
}

// Mock for voice service
export const mockVoiceService = {
  initializeVoice: () => Promise.resolve(),
  setCurrentUserId: () => {},
  joinVoiceChannel: () => Promise.resolve(),
  leaveVoiceChannel: () => Promise.resolve(),
  muteMicrophone: () => Promise.resolve(),
  unmuteMicrophone: () => Promise.resolve(),
  setMicrophoneVolume: () => Promise.resolve(),
  setSpeakerVolume: () => Promise.resolve(),
  dispose: () => {},
  onRemoteStreamAdded: undefined,
  onRemoteStreamRemoved: undefined,
}

// Mock for broadcast channel
export const mockBroadcastChannel = {
  isSupported: true,
  postMessage: () => {},
  broadcastAuth: () => {},
  broadcastChannelSwitch: () => {},
  broadcastMessage: () => {},
  broadcastVoice: () => {},
  broadcastTicket: () => {},
}

// Export all mocks
export default {
  types: mockTypes,
  modules: mockModules,
  env: mockEnv,
  supabase: mockSupabase,
  voiceService: mockVoiceService,
  broadcastChannel: mockBroadcastChannel,
}
