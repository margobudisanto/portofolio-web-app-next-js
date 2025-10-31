// Hook untuk Server-Sent Events (pengganti Socket.IO)
import { useEffect, useRef, useState } from 'react';

interface SSEMessage {
  type: string;
  data?: any;
  userId?: string;
  timestamp: string;
}

interface UseSSEOptions {
  userId?: string;
  onMessage?: (message: SSEMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useSSE(options: UseSSEOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = new URL('/api/socket', window.location.origin);
    if (options.userId) {
      url.searchParams.set('userId', options.userId);
    }

    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      options.onConnect?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        
        if (message.type === 'heartbeat') {
          // Handle heartbeat silently
          return;
        }
        
        options.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      setIsConnected(false);
      options.onError?.(error);
      
      // Auto-reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          connect();
        }
      }, 3000);
    };

    eventSource.addEventListener('close', () => {
      setIsConnected(false);
      options.onDisconnect?.();
    });
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  const sendMessage = async (type: string, data?: any, targetUserId?: string, broadcast = false) => {
    try {
      const response = await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          targetUserId,
          broadcast,
        }),
      });

      const result = await response.json();
      if (result.activeConnections !== undefined) {
        setConnectionCount(result.activeConnections);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Network error' };
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [options.userId]);

  return {
    isConnected,
    connectionCount,
    connect,
    disconnect,
    sendMessage,
  };
}