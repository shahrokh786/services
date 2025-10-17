import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    fetchChats();
    
    if (socket) {
      socket.on('new-message-notification', (data) => {
        // Refresh chats to show latest message
        fetchChats();
      });
    }

    return () => {
      if (socket) {
        socket.off('new-message-notification');
      }
    };
  }, [socket]);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chats/my-chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(participant => participant._id !== user.id);
  };

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const message = chat.lastMessage.content;
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  };

  if (loading) {
    return <div className="p-4">Loading chats...</div>;
  }

  return (
    <div className="w-80 bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          chats.map(chat => {
            const otherUser = getOtherParticipant(chat);
            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id, otherUser)}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={otherUser.profilePicture || '/default-avatar.png'}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessagePreview(chat)}
                    </p>
                  </div>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-400">
                      {new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;