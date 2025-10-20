import express from 'express';
const router = express.Router();
import {
    getAllServices,
    getServiceById,
    createService,
    getMyServices,
    updateService,
    deleteService,
} from '../controllers/serviceController.js'; // 1. Import the controller functions
import { protect, provider } from '../middleware/authMiddleware.js'; // Import the security guards

// --- PUBLIC ROUTES ---
// These routes are open to anyone.
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// --- PROTECTED PROVIDER ROUTES ---
// These routes require the user to be a logged-in provider.
// The `protect` middleware checks if they are logged in.
// The `provider` middleware checks if their role is 'provider'.

// The order of routes is important. Specific routes like '/my/services' must come before dynamic routes like '/:id'.
router.get('/my/services', protect, provider, getMyServices);

router.post('/', protect, provider, createService);
router.put('/:id', protect, provider, updateService);
router.delete('/:id', protect, provider, deleteService);

export default router;

