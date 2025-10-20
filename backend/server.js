import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http'; // 1. We still need to import this
import { Server } from 'socket.io'; // 2. And this

// --- All Your Existing Route Imports are Preserved ---
import serviceRoutes from './routes/serviceRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatroutes.js'; // 3. Import the new chat routes
import ContactMessage from './models/ContactMessage.js';

dotenv.config();

const app = express(); // 4. Your original Express app is the foundation
const server = createServer(app); // 5. We create the more powerful http server from it

// 6. We attach the Socket.IO "Post Office" to our new server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ======================
// MIDDLEWARE (Preserved)
// ======================
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true                
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================
// API ROUTES (Preserved and Upgraded)
// ======================
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes); // 7. Add the new chat route

// Your other routes are also preserved
app.get('/health', (req, res) => { /* ... */ });
app.post('/api/contact', async (req, res) => { /* ... */ });

// ======================
// REAL-TIME CHAT LOGIC (The "Post Office")
// ======================
// We need to keep track of which user is connected to which socket
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Send the list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


// ======================
// DATABASE & SERVER START (Upgraded)
// ======================
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');

        const PORT = process.env.PORT || 5000;
        // 8. CRITICAL: We start the new 'server' (with Socket.IO), not the old 'app'
        server.listen(PORT, () => {
            console.log(`🚀 Server & Chat Hub running on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('⚠️ Backend Startup Error:', error.message);
        process.exit(1);
    }
};

startServer();

// We need to export 'io' so our controller can use it
export { io };

