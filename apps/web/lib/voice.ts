import { VoiceParticipant, VoiceRoom } from './types'

export interface VoiceConnection {
  peerConnection: RTCPeerConnection
  stream: MediaStream
  userId: string
}

export class VoiceService {
  private localStream: MediaStream | null = null
  private peerConnections: Map<string, VoiceConnection> = new Map()
  private signalingSocket: WebSocket | null = null
  private currentChannelId: string | null = null
  private isConnected = false
  private currentUserId: string | null = null

  constructor(private signalingServerUrl: string) {}

  async initializeVoice(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
    } catch (error) {
      console.error('Failed to get user media:', error)
      throw error
    }
  }

  setCurrentUserId(userId: string): void {
    this.currentUserId = userId
  }

  async joinVoiceChannel(channelId: string): Promise<void> {
    if (this.currentChannelId === channelId) return

    // Leave current channel if any
    if (this.currentChannelId) {
      await this.leaveVoiceChannel()
    }

    this.currentChannelId = channelId
    await this.connectToSignalingServer()
  }

  async leaveVoiceChannel(): Promise<void> {
    if (this.signalingSocket) {
      this.signalingSocket.close()
      this.signalingSocket = null
    }

    // Close all peer connections
    for (const connection of this.peerConnections.values()) {
      connection.peerConnection.close()
    }
    this.peerConnections.clear()

    this.currentChannelId = null
    this.isConnected = false
  }

  private async connectToSignalingServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.signalingSocket = new WebSocket(this.signalingServerUrl)

      this.signalingSocket.onopen = () => {
        this.isConnected = true
        this.sendSignalingMessage({
          type: 'joinRoom',
          roomId: this.currentChannelId!,
          userId: this.currentUserId || 'unknown'
        })
        resolve()
      }

      this.signalingSocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        this.handleSignalingMessage(message)
      }

      this.signalingSocket.onerror = (error) => {
        console.error('Signaling socket error:', error)
        reject(error)
      }

      this.signalingSocket.onclose = () => {
        this.isConnected = false
      }
    })
  }

  private sendSignalingMessage(message: any): void {
    if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
      this.signalingSocket.send(JSON.stringify(message))
    }
  }

  private async handleSignalingMessage(message: any): Promise<void> {
    switch (message.type) {
      case 'userJoined':
        await this.handleUserJoined(message.userId)
        break
      case 'userLeft':
        await this.handleUserLeft(message.userId)
        break
      case 'offer':
        await this.handleOffer(message.userId, message.data)
        break
      case 'answer':
        await this.handleAnswer(message.userId, message.data)
        break
      case 'iceCandidate':
        await this.handleIceCandidate(message.userId, message.data)
        break
    }
  }

  private async handleUserJoined(userId: string): Promise<void> {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: this.getIceServers()
      })

      // Add local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, this.localStream!)
        })
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            type: 'iceCandidate',
            roomId: this.currentChannelId!,
            userId: this.currentUserId!,
            data: event.candidate
          })
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${userId}:`, peerConnection.connectionState)
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (this.onRemoteStreamAdded) {
          this.onRemoteStreamAdded(userId, event.streams[0])
        }
      }

      // Store connection
      this.peerConnections.set(userId, {
        peerConnection,
        stream: new MediaStream(),
        userId
      })

      // Create and send offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      this.sendSignalingMessage({
        type: 'offer',
        roomId: this.currentChannelId!,
        userId: this.currentUserId!,
        data: offer
      })

    } catch (error) {
      console.error('Failed to handle user joined:', error)
    }
  }

  private async handleUserLeft(userId: string): Promise<void> {
    const connection = this.peerConnections.get(userId)
    if (connection) {
      connection.peerConnection.close()
      this.peerConnections.delete(userId)
      
      if (this.onRemoteStreamRemoved) {
        this.onRemoteStreamRemoved(userId)
      }
    }
  }

  private async handleOffer(userId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: this.getIceServers()
      })

      // Add local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, this.localStream!)
        })
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            type: 'iceCandidate',
            roomId: this.currentChannelId!,
            userId: this.currentUserId!,
            data: event.candidate
          })
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${userId}:`, peerConnection.connectionState)
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (this.onRemoteStreamAdded) {
          this.onRemoteStreamAdded(userId, event.streams[0])
        }
      }

      // Store connection
      this.peerConnections.set(userId, {
        peerConnection,
        stream: new MediaStream(),
        userId
      })

      // Set remote description and create answer
      await peerConnection.setRemoteDescription(offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      this.sendSignalingMessage({
        type: 'answer',
        roomId: this.currentChannelId!,
        userId: this.currentUserId!,
        data: answer
      })

    } catch (error) {
      console.error('Failed to handle offer:', error)
    }
  }

  private async handleAnswer(userId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const connection = this.peerConnections.get(userId)
    if (connection) {
      try {
        await connection.peerConnection.setRemoteDescription(answer)
      } catch (error) {
        console.error('Failed to set remote description:', error)
      }
    }
  }

  private async handleIceCandidate(userId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const connection = this.peerConnections.get(userId)
    if (connection) {
      try {
        await connection.peerConnection.addIceCandidate(candidate)
      } catch (error) {
        console.error('Failed to add ICE candidate:', error)
      }
    }
  }

  private getIceServers(): RTCIceServer[] {
    const iceServers: RTCIceServer[] = []
    
    // Add STUN servers from environment
    const stunServers = process.env.NEXT_PUBLIC_STUN_SERVERS
    if (stunServers) {
      stunServers.split(',').forEach(server => {
        iceServers.push({ urls: server.trim() })
      })
    } else {
      // Default STUN servers
      iceServers.push(
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      )
    }

    // Add TURN servers from environment if available
    const turnServers = process.env.NEXT_PUBLIC_TURN_SERVERS
    if (turnServers) {
      iceServers.push({ urls: turnServers })
    }

    return iceServers
  }

  async muteMicrophone(): Promise<void> {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false
      })
    }
  }

  async unmuteMicrophone(): Promise<void> {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true
      })
    }
  }

  async setMicrophoneVolume(volume: number): Promise<void> {
    // This would require additional audio processing
    console.log('Setting microphone volume:', volume)
  }

  async setSpeakerVolume(volume: number): Promise<void> {
    // This would require additional audio processing
    console.log('Setting speaker volume:', volume)
  }

  // Callbacks for external components
  onRemoteStreamAdded?: (userId: string, stream: MediaStream) => void
  onRemoteStreamRemoved?: (userId: string) => void

  dispose(): void {
    this.leaveVoiceChannel()
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }
  }
}

// Create singleton instance
export const voiceService = new VoiceService(
  process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || 'wss://localhost:3001'
)
