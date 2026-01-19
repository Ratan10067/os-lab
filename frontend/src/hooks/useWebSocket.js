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

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    try {
      const ws = new WebSocket(url)
      ws.binaryType = 'arraybuffer'  // Handle binary data properly
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
      }

      ws.onmessage = async (event) => {
        if (messageHandlerRef.current) {
          let data = event.data
          
          // Convert ArrayBuffer to string
          if (data instanceof ArrayBuffer) {
            data = new TextDecoder().decode(data)
          }
          // Convert Blob to string
          else if (data instanceof Blob) {
            data = await data.text()
          }
          
          messageHandlerRef.current(data)
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

        // Attempt reconnection only if not a clean close
        if (event.code !== 1000 && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`)
          setTimeout(connect, RECONNECT_DELAY)
        } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          setError('Connection lost. Please refresh the page.')
        }
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      setError('Failed to connect')
    }
  }, [url])

  const disconnect = useCallback(() => {
    reconnectAttempts.current = MAX_RECONNECT_ATTEMPTS // Prevent reconnection
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
      return true
    }
    console.warn('WebSocket not connected, message not sent')
    return false
  }, [])

  const setMessageHandler = useCallback((handler) => {
    messageHandlerRef.current = handler
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, []) // Only run once on mount

  return {
    isConnected,
    error,
    sendMessage,
    setMessageHandler,
    reconnect: connect
  }
}

export default useWebSocket
