import express from 'express';
const router = express.Router();

// Import all the necessary "manager" functions from our controller files
import {
    getAllServices,
    getServiceById,
    createService,
    getMyServices,
    updateService,
    deleteService,
} from '../controllers/serviceController.js'; 
import { createServiceReview } from '../controllers/reviewController.js'; // Import the new review manager

// Import the "security guards"
import { protect, provider } from '../middleware/authMiddleware.js'; 

// --- PUBLIC ROUTES ---
// These routes are open to anyone to view services.
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// --- REVIEW ROUTE ---
// This route is for any logged-in user (a customer) to create a review.
// It is protected by the 'protect' middleware to ensure only authenticated users can post.
router.post('/:id/reviews', protect, createServiceReview);

// --- PROTECTED PROVIDER ROUTES ---
// These routes are only accessible to users who are logged in AND have the role of 'provider'.
router.get('/my/services', protect, provider, getMyServices);
router.post('/', protect, provider, createService);
router.put('/:id', protect, provider, updateService);
router.delete('/:id', protect, provider, deleteService);

export default router;

