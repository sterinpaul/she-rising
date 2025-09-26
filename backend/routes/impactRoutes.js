import express from 'express';
import impactControllers from '../controllers/impactControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadMultipleImages, handleUploadError } from '../middlewares/cloudinaryConfig.js';

const router = express.Router();
const {
    getAllImpacts,
    getImpactById,
    createImpact,
    updateImpact,
    deleteImpact
} = impactControllers();

// Public routes (no auth required)
router.get('/', getAllImpacts);
router.get('/:id', getImpactById);

// Protected routes (admin only - JWT required)
router.post('/', 
    authMiddleware,
    uploadMultipleImages('impact'),
    handleUploadError,
    createImpact
);

router.put('/:id', 
    authMiddleware,
    uploadMultipleImages('impact'),
    handleUploadError,
    updateImpact
);

router.delete('/:id', 
    authMiddleware,
    deleteImpact
);

export default router;