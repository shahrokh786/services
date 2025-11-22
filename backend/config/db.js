// File: backend/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // In test environment, we don't want to connect to the real DB
        // or if MONGODB_URI is not set, we might want to skip or use memory server.
        // However, the test setup handles memory server connection.
        // So this function should just do nothing if we are in test mode and already connected.
        if (process.env.NODE_ENV === 'test') {
             return;
        }

        // process.env.MONGODB_URI reads the connection string from your .env file
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the specific error message for easier debugging
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit the Node.js process with a failure code (1)
        // This prevents the server from running without a database connection
        process.exit(1);
    }
};

// --- This is the crucial line ---
// It makes the connectDB function available for import in server.js
export default connectDB;