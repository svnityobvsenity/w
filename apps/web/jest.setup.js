// Jest setup file for Next.js app
import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.NODE_ENV = 'test'

// Mock Supabase environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock signaling server URL
process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL = 'wss://test-signaling.railway.app'

// Mock other environment variables
process.env.NEXT_PUBLIC_APP_URL = 'https://test.vercel.app'
process.env.NEXT_PUBLIC_API_URL = 'https://test.vercel.app/api'

// Mock WebRTC APIs
global.RTCPeerConnection = jest.fn().mockImplementation(() => ({
  addTrack: jest.fn(),
  createOffer: jest.fn().mockResolvedValue({}),
  createAnswer: jest.fn().mockResolvedValue({}),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
  onicecandidate: null,
  ontrack: null,
  onconnectionstatechange: null,
  close: jest.fn(),
}))

global.MediaStream = jest.fn().mockImplementation(() => ({
  getTracks: jest.fn().mockReturnValue([]),
  getAudioTracks: jest.fn().mockReturnValue([]),
}))

global.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
}

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1, // OPEN
  onopen: null,
  onmessage: null,
  onerror: null,
  onclose: null,
}))

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
