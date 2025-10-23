// File: frontend/src/context/SocketContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
// Use correct relative path
import { useAuth } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    // --- ADDED: State for notifications ---
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    // Effect for socket connection management (login/logout)
    useEffect(() => {
        if (user) {
            const newSocket = io("http://localhost:5000", { // Your backend URL
                query: {
                    userId: user._id,
                },
            });
            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Cleanup on logout/unmount
            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    // --- ADDED: Effect for listening to application events ---
    useEffect(() => {
        if (socket) {
            // Listen for new messages
            socket.on("newMessage", (newMessage) => {
                console.log("SocketContext: Received newMessage event:", newMessage); // Debug log
                // Add a notification object to state
                setNotifications((prev) => [
                    ...prev,
                    { type: 'message', content: `New message...`, id: newMessage._id, senderId: newMessage.senderId } // Include senderId
                ]);
            });

            // Add listener for new bookings later if needed
            // socket.on("newBookingNotification", (booking) => { ... });

            // Cleanup listeners
            return () => {
                socket.off("newMessage");
                // socket.off("newBookingNotification");
            };
        }
    }, [socket]); // Run when socket connection is established/changes

    // --- ADDED: Function to clear notifications ---
    const clearNotificationsByType = (type) => {
        setNotifications((prev) => prev.filter((n) => n.type !== type));
    };

    // Provide socket, online users, notifications, and clear function
    const value = {
        socket,
        onlineUsers,
        notifications,
        clearNotificationsByType,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};