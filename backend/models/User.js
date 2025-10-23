// File: backend/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'], // Added validation message
        trim: true, // Remove leading/trailing whitespace
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [ // Added email format validation
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'], // Added length validation
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        required: true,
        enum: { // More robust enum definition with message
            values: ['customer', 'provider', 'admin'],
            message: '{VALUE} is not a supported role',
        },
        default: 'customer',
    },
    // --- ADDED: Common Profile fields ---
    profilePicture: {
        type: String, // URL to image (e.g., Cloudinary)
        default: '',
    },
    phone: {
        type: String,
        default: '',
        // Consider adding validation for phone format based on target region (e.g., Portugal)
    },
    location: {
        city: { type: String, trim: true },
        state: { type: String, trim: true }, // Or region/district
        // postalCode: { type: String, trim: true }, // Optional addition
    },
    // --- ADDED: Provider specific fields (nested object) ---
    providerProfile: {
        // Only required if role is 'provider'
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        skills: [{ // Array of strings for searchable skills
            type: String,
            trim: true,
            lowercase: true,
        }],
        hourlyRate: {
            type: Number,
            min: [0, 'Hourly rate cannot be negative'],
        },
        // --- Future Enhancements for Provider Profile ---
        // availability: { type: String }, // e.g., 'Mon-Fri 9am-5pm'
        // serviceAreas: [{ type: String }], // e.g., ['Lisbon', 'Porto'] if different from main location
        // averageRating: { type: Number, default: 0 },
        // totalBookings: { type: Number, default: 0 },
        // isVerified: { type: Boolean, default: false }, // For admin verification later
    },
    isAdmin: { // Can still be useful, though role='admin' is primary
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

// --- Password Hashing Middleware (Unchanged) ---
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Password Comparison Method (Improved) ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Need to explicitly select the password field for comparison as it's excluded by default
    const userWithPassword = await this.constructor.findOne({ _id: this._id }).select('+password');
    // If user not found (edge case), return false
    if (!userWithPassword) return false;
    return await bcrypt.compare(enteredPassword, userWithPassword.password);
};

// --- Prevent OverwriteModelError ---
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;