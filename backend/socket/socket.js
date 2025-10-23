// File: backend/socket/socket.js

import { Server } from "socket.io";

let io;
// Ensure userSocketMap is reliably updated
const userSocketMap = {}; // { userId: socketId }

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.on("connection", (socket) => {
        console.log(`[Socket.IO] User Connected: ${socket.id}`);
        const userId = socket.handshake.query.userId;
        // Log the received userId type for clarity
        console.log(`[Socket.IO] Received userId from handshake: ${userId} (Type: ${typeof userId})`);

        // Use strict check for "undefined" string
        if (userId && userId !== "undefined") {
            console.log(`[Socket.IO] Mapping userId '${userId}' to socketId ${socket.id}`);
            userSocketMap[userId] = socket.id;
        } else {
             console.log(`[Socket.IO] WARNING: Connection received without a valid userId query parameter.`);
        }
        // Log the map state AFTER potential update
        console.log("[Socket.IO] Current userSocketMap:", userSocketMap);

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log(`[Socket.IO] User Disconnected: ${socket.id}`);
            // Find the userId associated with THIS disconnecting socket
            let disconnectedUserId = null;
            for (const uid in userSocketMap) {
                if (userSocketMap[uid] === socket.id) {
                    disconnectedUserId = uid;
                    break;
                }
            }
            if (disconnectedUserId) {
                 console.log(`[Socket.IO] Deleting mapping for userId '${disconnectedUserId}' (Socket: ${socket.id})`);
                 delete userSocketMap[disconnectedUserId];
                 console.log("[Socket.IO] Updated userSocketMap after disconnect:", userSocketMap);
                 io.emit("getOnlineUsers", Object.keys(userSocketMap));
            } else {
                 console.log(`[Socket.IO] WARNING: Disconnecting socket ${socket.id} had no associated userId in map.`);
            }
        });
    });
};

const getReceiverSocketId = (receiverId) => {
    // Log the type being looked up
    console.log(`[Socket.IO] getReceiverSocketId: Looking up ID '${receiverId}' (Type: ${typeof receiverId})`);
    const socketId = userSocketMap[receiverId]; // Direct lookup
    console.log(`[Socket.IO] Found socketId: ${socketId}`);
    return socketId;
};

// Export userSocketMap for debugging in controller
export { initializeSocket, getReceiverSocketId, io, userSocketMap };