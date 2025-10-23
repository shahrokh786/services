// File: backend/socket/socket.js

import { Server } from "socket.io";

// Module-scoped variables for the Socket.IO server instance and user mapping
let io;
const userSocketMap = {}; // { userId: socketId }

// Initializes the Socket.IO server, attaching it to the main HTTP server
const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            // Use environment variable for frontend URL in production
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.on("connection", (socket) => {
        console.log("[Socket.IO] User Connected:", socket.id);
        const userId = socket.handshake.query.userId;
        console.log(`[Socket.IO] User ID from handshake: ${userId}`);

        // Map userId to socketId if valid
        if (userId && userId !== "undefined") {
            console.log(`[Socket.IO] Mapping userId ${userId} to socketId ${socket.id}`);
            userSocketMap[userId] = socket.id;
        } else {
             console.log(`[Socket.IO] WARNING: User connected without a valid userId.`);
        }
        console.log("[Socket.IO] Current userSocketMap:", userSocketMap);

        // Emit the updated list of online user IDs
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`[Socket.IO] User Disconnected: ${socket.id}, associated userId: ${userId}`);
            if (userId && userSocketMap[userId] === socket.id) { // Ensure correct socket is removed
                delete userSocketMap[userId];
                console.log("[Socket.IO] Updated userSocketMap after disconnect:", userSocketMap);
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        });
    });
};

// Helper function to get a user's current socket ID
const getReceiverSocketId = (receiverId) => {
    console.log(`[Socket.IO] Looking up socket ID for receiverId: ${receiverId}`);
    const socketId = userSocketMap[receiverId];
    console.log(`[Socket.IO] Found socketId: ${socketId}`);
    return socketId;
};

// Export the initializer, the helper, and the io instance itself
// We also export userSocketMap for logging/debugging purposes elsewhere
export { initializeSocket, getReceiverSocketId, io, userSocketMap };