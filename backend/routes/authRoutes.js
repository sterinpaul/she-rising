import express from 'express';
import authControllers from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authAdminRoutes = () => {
    const router = express.Router();
    const controllers = authControllers();

    router.post('/signIn',controllers.signIn)
    router.post('/signOut',authMiddleware, controllers.signOut);
    router.get('/status', authMiddleware, controllers.checkAuthStatus);

    return router;
}

export default authAdminRoutes;