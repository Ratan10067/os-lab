import { useEffect, useRef, useCallback, useState } from 'react'

const RECONNECT_DELAY = 3000
const MAX_RECONNECT_ATTEMPTS = 5

export function useWebSocket(url) {
  const wsRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const messageHandlerRef = useRef(null)

  const connect = useCallback(() => {
    if (!url) return

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        if (messageHandlerRef.current) {
          messageHandlerRef.current(event.data)
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('Connection error')
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        setIsConnected(false)
        wsRef.current = null

        // Attempt reconnection
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`)
          setTimeout(connect, RECONNECT_DELAY)
        } else {
          setError('Connection lost. Please refresh the page.')
        }
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      setError('Failed to connect')
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
      return true
    }
    return false
  }, [])

  const setMessageHandler = useCallback((handler) => {
    messageHandlerRef.current = handler
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return {
    isConnected,
    error,
    sendMessage,
    setMessageHandler,
    reconnect: connect
  }
}

export default useWebSocket
