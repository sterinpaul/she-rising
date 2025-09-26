import express from 'express';
import articleControllers from '../controllers/articleControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadMultipleImages, handleUploadError } from '../middlewares/cloudinaryConfig.js';

const router = express.Router();
const {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = articleControllers();

// Public routes (no auth required)
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

// Protected routes (admin only - JWT required)
router.post('/', 
    authMiddleware,
    uploadMultipleImages('article'),
    handleUploadError,
    createArticle
);

router.put('/:id', 
    authMiddleware,
    uploadMultipleImages('article'),
    handleUploadError,
    updateArticle
);

router.delete('/:id', 
    authMiddleware,
    deleteArticle
);

export default router;