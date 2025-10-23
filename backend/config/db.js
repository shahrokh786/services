// File: backend/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
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