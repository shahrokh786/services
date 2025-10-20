import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

// --- All Your Existing Route Imports are Preserved ---
import serviceRoutes from './routes/serviceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ContactMessage from './models/ContactMessage.js';

dotenv.config();

const app = express();
const server = createServer(app);

// THIS IS THE SINGLE, TRUE 'io' INSTANCE FOR YOUR ENTIRE APPLICATION
export const io = new Server(server, {
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
app.use('/api/chats', chatRoutes); // The new chat route is correctly added

// Your other routes are also preserved
app.get('/health', (req, res) => {
    res.json({ status: 'OK ✅', message: 'Backend is running perfectly!' });
});
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) { return res.status(400).json({ success: false, message: 'Name, email, and message required' }); }
        const newMessage = new ContactMessage({ name, email, subject: subject || 'No Subject', message });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message received!' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ======================
// REAL-TIME CHAT LOGIC (The "Post Office")
// ======================
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

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
        // We now start the new 'server' (with Socket.IO)
        server.listen(PORT, () => {
            console.log(`🚀 Server & Chat Hub running on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('⚠️ Backend Startup Error:', error.message);
        process.exit(1);
    }
};

startServer();

