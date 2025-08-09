'use client'

import React, { useState, useEffect, useRef } from 'react'
import { User } from '@fride/types'

interface VoiceControlsProps {
  user: User
}

export default function VoiceControls({ user }: VoiceControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const wsRef = useRef<WebSocket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const signalingServerUrl = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || 'wss://localhost:3001'

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
      peerConnectionsRef.current.forEach(conn => conn.close())
    }
  }, [])

  const handleMuteToggle = async () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
        
        // Notify other peers about mute state
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'muteState',
            userId: user.id,
            isMuted: !audioTrack.enabled
          }))
        }
      }
    }
  }

  const handleDeafenToggle = async () => {
    setIsDeafened(!isDeafened)
    
    // Mute/unmute all remote audio streams
    peerConnectionsRef.current.forEach(conn => {
      const receivers = conn.getReceivers()
      receivers.forEach(receiver => {
        if (receiver.track && receiver.track.kind === 'audio') {
          receiver.track.enabled = !isDeafened
        }
      })
    })
  }

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
      peerConnectionsRef.current.forEach(conn => conn.close())
      peerConnectionsRef.current.clear()
      
      setIsConnected(false)
      setIsMuted(false)
      setIsDeafened(false)
      return
    }

    try {
      setIsConnecting(true)
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      })
      localStreamRef.current = stream

      // Connect to signaling server
      const ws = new WebSocket(signalingServerUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('Connected to signaling server')
        // Join voice room
        ws.send(JSON.stringify({
          type: 'joinRoom',
          roomId: 'general', // Default to general channel
          userId: user.id
        }))
      }

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data)
        
        switch (message.type) {
          case 'userJoined':
            await handleUserJoined(message.userId, message.userId !== user.id)
            break
          case 'userLeft':
            handleUserLeft(message.userId)
            break
          case 'offer':
            await handleOffer(message)
            break
          case 'answer':
            await handleAnswer(message)
            break
          case 'iceCandidate':
            await handleIceCandidate(message)
            break
        }
      }

      ws.onclose = () => {
        console.log('Disconnected from signaling server')
        setIsConnected(false)
        setIsConnecting(false)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnecting(false)
      }

    } catch (error) {
      console.error('Error connecting to voice:', error)
      setIsConnecting(false)
    }
  }

  const handleUserJoined = async (userId: string, isInitiator: boolean) => {
    if (userId === user.id) {
      setIsConnected(true)
      setIsConnecting(false)
      return
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: process.env.NEXT_PUBLIC_STUN_SERVERS?.split(',') || ['stun:stun.l.google.com:19302'] }
      ]
    })

    peerConnectionsRef.current.set(userId, peerConnection)

    // Add local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!)
      })
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      const audioElement = document.createElement('audio')
      audioElement.srcObject = event.streams[0]
      audioElement.autoplay = true
      audioElement.muted = isDeafened
      document.body.appendChild(audioElement)
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'iceCandidate',
          userId: user.id,
          targetUserId: userId,
          candidate: event.candidate
        }))
      }
    }

    if (isInitiator) {
      // Create and send offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'offer',
          userId: user.id,
          targetUserId: userId,
          offer
        }))
      }
    }
  }

  const handleUserLeft = (userId: string) => {
    const peerConnection = peerConnectionsRef.current.get(userId)
    if (peerConnection) {
      peerConnection.close()
      peerConnectionsRef.current.delete(userId)
    }
  }

  const handleOffer = async (message: any) => {
    const peerConnection = peerConnectionsRef.current.get(message.userId)
    if (peerConnection) {
      await peerConnection.setRemoteDescription(message.offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          userId: user.id,
          targetUserId: message.userId,
          answer
        }))
      }
    }
  }

  const handleAnswer = async (message: any) => {
    const peerConnection = peerConnectionsRef.current.get(message.userId)
    if (peerConnection) {
      await peerConnection.setRemoteDescription(message.answer)
    }
  }

  const handleIceCandidate = async (message: any) => {
    const peerConnection = peerConnectionsRef.current.get(message.userId)
    if (peerConnection) {
      await peerConnection.addIceCandidate(message.candidate)
    }
  }

  if (isConnecting) {
    return (
      <div className="bg-background-secondary border-t border-border p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary mr-3"></div>
          <span className="text-text-secondary">Connecting to voice...</span>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-background-secondary border-t border-border p-4">
        <div className="flex items-center justify-center">
          <button
            onClick={handleConnect}
            className="px-6 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors flex items-center space-x-2"
          >
            <span>Join Voice Channel</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border-t border-border p-4">
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleMuteToggle}
          className={`p-3 rounded-full transition-colors ${
            isMuted 
              ? 'bg-accent-red text-white' 
              : 'bg-background-tertiary text-text-primary hover:bg-background-quaternary'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleDeafenToggle}
          className={`p-3 rounded-full transition-colors ${
            isDeafened 
              ? 'bg-accent-red text-white' 
              : 'bg-background-tertiary text-text-primary hover:bg-background-quaternary'
          }`}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-accent-red text-white rounded-md hover:bg-accent-red/90 transition-colors"
        >
          Leave Voice
        </button>
      </div>
    </div>
  )
}
