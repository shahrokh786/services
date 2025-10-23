// File: backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Local Imports ---
import connectDB from './config/db.js';
import { initializeSocket } from './socket/socket.js';
// --- CORRECT: Ensure errorMiddleware exists and is imported ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Route Imports ---
import serviceRoutes from './routes/serviceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; // Assuming exists

// --- Configuration ---
dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

initializeSocket(server); // Initialize Socket Hub

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static File Serving ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// API ROUTES
// ======================
app.use('/api/health', (req, res) => res.json({ status: 'OK', message: 'API is running' }));
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/contact', contactRoutes);

// ======================
// ERROR HANDLING MIDDLEWARE (Must be AFTER API routes)
// ======================
// --- CORRECT: Uncommented and placed correctly ---
app.use(notFound);
app.use(errorHandler);

// ======================
// DATABASE & SERVER START
// ======================
const startServer = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server & Socket Hub running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('⚠️ Server Listen Error:', error.message);
        process.exit(1);
    }
};

startServer();

// REMOVED old socket logic and exports