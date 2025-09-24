import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import articleRoutes from './articleRoutes.js';
import impactRoutes from './impactRoutes.js';


const routes = (app)=>{
    app.use('/api/auth',authRoutes());
    app.use('/api/admin',authMiddleware,adminRoutes());
    app.use('/api/articles',articleRoutes);
    app.use('/api/impacts',impactRoutes);
}

export default routes