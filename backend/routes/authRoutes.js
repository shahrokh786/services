import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
} from '../controllers/authController.js'; // 1. Import the controller functions
import { protect } from '../middleware/authMiddleware.js'; // Import the security guard

// 2. Define the routes and point them to the controller functions
// Notice how clean and readable this is. The route file now only defines the paths.

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Private route (protected by the 'protect' middleware)
router.get('/profile', protect, getUserProfile);

export default router;

