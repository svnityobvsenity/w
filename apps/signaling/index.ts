import { WebSocketServer, WebSocket } from 'ws'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

const app = express()
const server = createServer(app)

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    connections: connections.size,
    rooms: rooms.size
  })
})

// WebSocket server with CORS headers
const wss = new WebSocketServer({ 
  server,
  verifyClient: (info) => {
    // Allow all origins for WebSocket connections
    return true
  }
})

// Store active connections and rooms
const connections = new Map<string, WebSocket>()
const rooms = new Map<string, Set<string>>()

interface SignalingMessage {
  type: 'joinRoom' | 'offer' | 'answer' | 'iceCandidate' | 'leave'
  roomId: string
  userId: string
  data?: any
}

wss.on('connection', (ws: WebSocket, req) => {
  console.log(`New WebSocket connection from ${req.socket.remoteAddress}`)
  
  let userId: string | null = null
  let currentRoom: string | null = null

  ws.on('message', (message: string) => {
    try {
      const msg: SignalingMessage = JSON.parse(message)
      
      switch (msg.type) {
        case 'joinRoom':
          handleJoinRoom(ws, msg, userId, currentRoom)
          userId = msg.userId
          currentRoom = msg.roomId
          break
          
        case 'offer':
          handleOffer(msg)
          break
          
        case 'answer':
          handleAnswer(msg)
          break
          
        case 'iceCandidate':
          handleIceCandidate(msg)
          break
          
        case 'leave':
          handleLeave(ws, userId, currentRoom)
          break
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  ws.on('close', () => {
    if (userId && currentRoom) {
      handleLeave(ws, userId, currentRoom)
    }
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

function handleJoinRoom(ws: WebSocket, msg: SignalingMessage, userId: string | null, currentRoom: string | null) {
  // Leave previous room if any
  if (userId && currentRoom) {
    handleLeave(ws, userId, currentRoom)
  }

  const { roomId, userId: newUserId } = msg
  
  // Store connection
  connections.set(newUserId, ws)
  
  // Add user to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  rooms.get(roomId)!.add(newUserId)
  
  // Notify other users in the room
  const roomUsers = rooms.get(roomId)!
  roomUsers.forEach(userId => {
    if (userId !== newUserId) {
      const userWs = connections.get(userId)
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({
          type: 'userJoined',
          roomId,
          userId: newUserId
        }))
      }
    }
  })
  
  console.log(`User ${newUserId} joined room ${roomId}`)
}

function handleOffer(msg: SignalingMessage) {
  const { roomId, userId, data } = msg
  const roomUsers = rooms.get(roomId)
  
  if (roomUsers) {
    roomUsers.forEach(roomUserId => {
      if (roomUserId !== userId) {
        const userWs = connections.get(roomUserId)
        if (userWs && userWs.readyState === WebSocket.OPEN) {
          userWs.send(JSON.stringify({
            type: 'offer',
            roomId,
            userId,
            data
          }))
        }
      }
    })
  }
}

function handleAnswer(msg: SignalingMessage) {
  const { roomId, userId, data } = msg
  const roomUsers = rooms.get(roomId)
  
  if (roomUsers) {
    roomUsers.forEach(roomUserId => {
      if (roomUserId !== userId) {
        const userWs = connections.get(roomUserId)
        if (userWs && userWs.readyState === WebSocket.OPEN) {
          userWs.send(JSON.stringify({
            type: 'answer',
            roomId,
            userId,
            data
          }))
        }
      }
    })
  }
}

function handleIceCandidate(msg: SignalingMessage) {
  const { roomId, userId, data } = msg
  const roomUsers = rooms.get(roomId)
  
  if (roomUsers) {
    roomUsers.forEach(roomUserId => {
      if (roomUserId !== userId) {
        const userWs = connections.get(roomUserId)
        if (userWs && userWs.readyState === WebSocket.OPEN) {
          userWs.send(JSON.stringify({
            type: 'iceCandidate',
            roomId,
            userId,
            data
          }))
        }
      }
    })
  }
}

function handleLeave(ws: WebSocket, userId: string | null, roomId: string | null) {
  if (!userId || !roomId) return
  
  // Remove user from room
  const roomUsers = rooms.get(roomId)
  if (roomUsers) {
    roomUsers.delete(userId)
    
    // Notify other users
    roomUsers.forEach(roomUserId => {
      const userWs = connections.get(roomUserId)
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({
          type: 'userLeft',
          roomId,
          userId
        }))
      }
    })
    
    // Remove room if empty
    if (roomUsers.size === 0) {
      rooms.delete(roomId)
    }
  }
  
  // Remove connection
  connections.delete(userId)
  
  console.log(`User ${userId} left room ${roomId}`)
}

// Get room info
app.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params
  const roomUsers = rooms.get(roomId)
  
  if (roomUsers) {
    res.json({
      roomId,
      userCount: roomUsers.size,
      users: Array.from(roomUsers)
    })
  } else {
    res.status(404).json({ error: 'Room not found' })
  }
})

const PORT = process.env.SIGNALING_SERVER_PORT || 3001

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
  console.log(`WebSocket server ready for WebRTC connections`)
})
