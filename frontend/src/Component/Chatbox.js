import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io("https://chat-application-backend-9ejl.onrender.com");

function ChatBox({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('register', currentUser);

    socket.on('chat message', (msg) => {
      if ((msg.from === selectedUser && msg.to === currentUser) || 
          (msg.from === currentUser && msg.to === selectedUser)) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    socket.on('previous messages', (msgs) => {
      setMessages(msgs);
    });

    socket.on('error', (errorMsg) => {
      console.error('Socket error:', errorMsg);
    });

    return () => {
      socket.off('chat message');
      socket.off('previous messages');
      socket.off('error');
    };
  }, [currentUser, selectedUser]); // Add `selectedUser` to the dependency array

  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      socket.emit('get messages', { user1: currentUser, user2: selectedUser });
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { from: currentUser, to: selectedUser, message: message.trim() };
      socket.emit('chat message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state immediately
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{
        textAlign: 'center',
        backgroundColor: '#fff',
        color: '#666',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '20px 10px',
        fontSize: '24px'
      }}>
        Chat with {selectedUser}
      </h2>
      <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.from === currentUser ? 'right' : 'left',
            margin: msg.from === currentUser ? '10px 10px 10px auto' : '10px auto 10px 10px',
            padding: '10px',
            backgroundColor: msg.from === currentUser ? '#dcf8c6' : '#f0f0f0',
            borderRadius: '10px',
            maxWidth: '30%',
            alignSelf: msg.from === currentUser ? 'flex-end' : 'flex-start',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            <strong>{msg.from === currentUser ? 'You' : msg.from}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
          placeholder="Type a message..."
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
