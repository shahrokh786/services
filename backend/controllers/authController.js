// File: backend/controllers/authController.js

import User from '../models/User.js'; // Ensure correct path to your User model
import generateToken from '../utils/generateToken.js';

// --- Helper Function for Consistent User Object Response ---
// Selects fields to return, excluding password and sensitive info
const formatUserResponse = (user) => {
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        phone: user.phone,
        location: user.location,
    };
    // Include providerProfile only if the user is a provider
    if (user.role === 'provider') {
        userData.providerProfile = user.providerProfile;
    }
    return { user: userData }; // Always nest under 'user' key for frontend consistency
};

// @desc    Register a new user (customer or provider)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => { // Added next for error handling
    const { name, email, password, phone, role } = req.body;

    // Basic input validation
    if (!name || !email || !password || !role) {
         return res.status(400).json({ message: 'Please provide name, email, password, and role' });
    }
    if (!['customer', 'provider'].includes(role)) {
         return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user object - Mongoose validation will run here
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            // Initialize providerProfile if role is provider, otherwise it defaults
            providerProfile: role === 'provider' ? {} : undefined
        });

        generateToken(res, user._id); // Set JWT cookie

        res.status(201).json(formatUserResponse(user)); // Return formatted user data

    } catch (error) {
         // --- Enhanced Error Handling ---
         if (error.name === 'ValidationError') {
             // Extract specific Mongoose validation errors
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ message: messages.join('. ') });
         }
         console.error('Registration Error:', error); // Log unexpected errors
         res.status(500).json({ message: 'Server registration error' });
         // next(error); // Optionally pass to a generic error handler middleware
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Find user by email - explicitly select password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id); // Set JWT cookie

            // Fetch user again *without* password to send back
            const userToSend = await User.findById(user._id);
            res.status(200).json(formatUserResponse(userToSend)); // Return formatted data

        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server login error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (should ideally require auth to logout)
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        // Add secure: true, sameSite: 'Strict' in production with HTTPS
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Relies on authMiddleware setting req.user)
const getUserProfile = async (req, res) => {
    // req.user is set by the protect middleware.
    // We assume it contains the necessary user details already.
    // If not, we might need to fetch the full user object here.
    if (req.user) {
         // Re-fetch to ensure we get the latest data and correct fields
         try {
             const user = await User.findById(req.user._id);
             if (user) {
                 res.json(formatUserResponse(user));
             } else {
                  res.status(404).json({ message: 'User not found' });
             }
         } catch(error) {
              console.error('Get Profile Error:', error);
              res.status(500).json({ message: 'Server error fetching profile' });
         }
    } else {
        // This case shouldn't be reachable if 'protect' middleware is used correctly
        res.status(401).json({ message: 'Not authorized, no user data found' });
    }
};


// --- Future: Add updateUserProfile function here ---
// const updateUserProfile = async (req, res) => { ... }


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    // updateUserProfile,
};