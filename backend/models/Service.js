// backend/models/Service.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: { type: String, required: true, default: 'per hour' }, 
    images: [{ type: String }], 
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema], 
    experience: { type: String }, 
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;