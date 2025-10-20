import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, provider } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer to store files in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the upload route. It's protected so only logged-in providers can upload.
// upload.single('image') is the multer middleware that looks for a file named 'image'
router.post('/', protect, provider, upload.single('image'), uploadImage);

export default router;