import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service', // Links to the Service model
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model (the customer)
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model (the service provider)
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String, // e.g., 'morning', 'afternoon'
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String, // Additional notes from the customer
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
