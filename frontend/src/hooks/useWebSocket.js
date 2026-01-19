import { useEffect, useRef, useCallback, useState } from 'react'

const RECONNECT_DELAY = 3000
const MAX_RECONNECT_ATTEMPTS = 5

export function useWebSocket(url) {
  const wsRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const messageHandlerRef = useRef(null)
  const mountedRef = useRef(true)

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.onopen = null
      wsRef.current.onclose = null
      wsRef.current.onerror = null
      wsRef.current.onmessage = null
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close()
      }
      wsRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) return

    cleanup()

    try {
      console.log('Creating WebSocket connection to:', url)
      const ws = new WebSocket(url)
      ws.binaryType = 'arraybuffer'
      wsRef.current = ws

      ws.onopen = () => {
        if (!mountedRef.current) return
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
      }

      ws.onmessage = async (event) => {
        if (!mountedRef.current) return
        if (messageHandlerRef.current) {
          let data = event.data
          if (data instanceof ArrayBuffer) {
            data = new TextDecoder().decode(data)
          } else if (data instanceof Blob) {
            data = await data.text()
          }
          messageHandlerRef.current(data)
        }
      }

      ws.onerror = () => {
        if (!mountedRef.current) return
        console.error('WebSocket error')
        setError('Connection error')
      }

      ws.onclose = () => {
        if (!mountedRef.current) return
        console.log('WebSocket closed')
        setIsConnected(false)
        wsRef.current = null

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`)
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect()
            }
          }, RECONNECT_DELAY)
        } else {
          setError('Connection lost. Please refresh the page.')
        }
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      setError('Failed to connect')
    }
  }, [url, cleanup])

  const sendMessage = useCallback((message) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message)
      return true
    }
    console.warn('WebSocket not ready, state:', ws?.readyState)
    return false
  }, [])

  const setMessageHandler = useCallback((handler) => {
    messageHandlerRef.current = handler
  }, [])

  useEffect(() => {
    mountedRef.current = true
    connect()
    
    return () => {
      mountedRef.current = false
      cleanup()
    }
  }, [connect, cleanup])

  return {
    isConnected,
    error,
    sendMessage,
    setMessageHandler,
    reconnect: connect
  }
}

export default useWebSocket
