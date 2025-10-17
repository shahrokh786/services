import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new-message-notification', (data) => {
        addNotification({
          type: 'message',
          title: 'New Message',
          message: `${data.sender}: ${data.message}`,
          data
        });
      });

      // Add more notification types as needed
    }

    return () => {
      if (socket) {
        socket.off('new-message-notification');
      }
    };
  }, [socket]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [newNotification, ...prev]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 w-80"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;