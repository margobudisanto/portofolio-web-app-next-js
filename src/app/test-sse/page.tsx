// Test page untuk SSE functionality
'use client';

import { useSSE } from '@/hooks/useSSE';
import { useState } from 'react';

export default function TestSSE() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const { isConnected, connectionCount, sendMessage } = useSSE({
    userId: 'test-user',
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
    onConnect: () => {
      console.log('SSE Connected');
    },
    onDisconnect: () => {
      console.log('SSE Disconnected');
    },
  });

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      await sendMessage('test-message', { text: inputMessage }, undefined, true);
      setInputMessage('');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SSE Test Page</h1>
      
      <div className="mb-4">
        <p>Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p>Active Connections: {connectionCount}</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 mr-2 rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Broadcast
        </button>
      </div>

      <div className="border p-4 h-64 overflow-y-auto">
        <h3 className="font-semibold mb-2">Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <strong>{msg.type}:</strong> {JSON.stringify(msg.data)}
            <br />
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>
    </div>
  );
}