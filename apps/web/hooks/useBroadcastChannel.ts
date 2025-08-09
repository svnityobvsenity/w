import { useEffect, useCallback } from 'react'

interface BroadcastMessage {
  type: string
  payload: any
}

export function useBroadcastChannel(channelName: string = 'fride-app') {
  const channel = typeof window !== 'undefined' ? new BroadcastChannel(channelName) : null

  const broadcastMessage = useCallback((type: string, payload: any) => {
    if (channel) {
      const message: BroadcastMessage = { type, payload }
      channel.postMessage(message)
    }
  }, [channel])

  const subscribeToMessages = useCallback((callback: (message: BroadcastMessage) => void) => {
    if (!channel) return () => {}

    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      callback(event.data)
    }

    channel.addEventListener('message', handleMessage)
    
    return () => {
      channel.removeEventListener('message', handleMessage)
    }
  }, [channel])

  useEffect(() => {
    return () => {
      if (channel) {
        channel.close()
      }
    }
  }, [channel])

  return {
    broadcastMessage,
    subscribeToMessages,
    isSupported: typeof window !== 'undefined' && 'BroadcastChannel' in window
  }
}

// Hook for listening to specific message types
export function useBroadcastListener(
  messageType: string,
  callback: (payload: any) => void
) {
  const { onMessage } = useBroadcastChannel({
    onMessage: (message) => {
      if (message.type === messageType) {
        callback(message.payload)
      }
    }
  })

  return { onMessage }
}

// Hook for syncing state across tabs
export function useTabSync<T>(
  key: string,
  defaultValue: T,
  onSync: (value: T) => void
) {
  const { postMessage } = useBroadcastChannel()

  const syncValue = useCallback((value: T) => {
    postMessage({
      type: 'state:sync',
      payload: { key, value }
    })
  }, [postMessage, key])

  const { onMessage } = useBroadcastChannel({
    onMessage: (message) => {
      if (message.type === 'state:sync' && message.payload.key === key) {
        onSync(message.payload.value)
      }
    }
  })

  return { syncValue, onMessage }
}
