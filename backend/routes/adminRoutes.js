import express from 'express'
import articleControllers from '../controllers/articleControllers.js';
import impactControllers from '../controllers/impactControllers.js';
import dashboardControllers from '../controllers/dashboardControllers.js';
import { uploadMultipleImages, handleUploadError } from '../middlewares/cloudinaryConfig.js';

const {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = articleControllers();
const {
    getAllImpacts,
    getImpactById,
    createImpact,
    updateImpact,
    deleteImpact
} = impactControllers();
const {
    getDashboardOverview,
    getDashboardStats,
    getRecentArticles,
    getRecentImpacts
} = dashboardControllers();


const adminRoutes = ()=>{
    const router = express.Router();

    // Dashboard routes
    router.get('/dashboard/overview', getDashboardOverview);
    router.get('/dashboard/stats', getDashboardStats);
    router.get('/dashboard/recent-articles', getRecentArticles);
    router.get('/dashboard/recent-impacts', getRecentImpacts);

    // Article routes
    router.get('/articles', getAllArticles)
    router.get('/article/:id', getArticleById)
    router.post('/add-article',uploadMultipleImages("article"), handleUploadError, createArticle)
    router.put('/edit-article/:id',uploadMultipleImages("article"), handleUploadError, updateArticle)
    router.delete('/delete-article/:id',deleteArticle)
    
    // Impact routes
    router.get('/impacts', getAllImpacts)
    router.get('/impact/:id', getImpactById)
    router.post('/add-impact',uploadMultipleImages("impact"), handleUploadError, createImpact)
    router.put('/edit-impact/:id',uploadMultipleImages("impact"), handleUploadError, updateImpact)
    router.delete('/delete-impact/:id',deleteImpact)
    
    return router
}

export default adminRoutes