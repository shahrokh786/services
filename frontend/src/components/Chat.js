import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Chat = ({ chatId, onClose, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      joinChat();
    }

    return () => {
      if (socket && chatId) {
        socket.emit('typing-stop', { chatId, userId: user.id });
        socket.off('receive-message');
        socket.off('user-typing');
        socket.off('user-stop-typing');
      }
    };
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('user-typing', (data) => {
        setTypingUsers(prev => {
          if (!prev.find(u => u.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        });
      });

      socket.on('user-stop-typing', (data) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      });
    }

    return () => {
      if (socket) {
        socket.off('receive-message');
        socket.off('user-typing');
        socket.off('user-stop-typing');
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chats/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChat = () => {
    if (socket && chatId) {
      socket.emit('join-chat', chatId);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      chatId,
      senderId: user.id,
      senderName: user.name,
      recipientId: otherUser.id,
      content: newMessage.trim()
    };

    socket.emit('send-message', messageData);
    setNewMessage('');
    stopTyping();
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing-start', {
        chatId,
        userId: user.id,
        userName: user.name
      });
    }
  };

  const stopTyping = () => {
    if (socket) {
      socket.emit('typing-stop', {
        chatId,
        userId: user.id
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex items-center justify-center">
        <div>Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={otherUser.profilePicture || '/default-avatar.png'}
            alt={otherUser.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold">{otherUser.name}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 ${
                message.sender._id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender._id === user.id ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicators */}
        {typingUsers.map((typingUser) => (
          <div key={typingUser.userId} className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-3 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onBlur={stopTyping}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;