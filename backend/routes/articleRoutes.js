import express from 'express';
import articleControllers from '../controllers/articleControllers.js';

const router = express.Router();
const {
    getAllArticles,
    getArticleById
} = articleControllers();

router.get('/',getAllArticles)
router.get('/:id',getArticleById)

export default router;