import express from 'express';
import impactControllers from '../controllers/impactControllers.js';

const router = express.Router();
const {
    getAllImpacts,
    getImpactById
} = impactControllers();

router.get('/',getAllImpacts)
router.get('/:id',getImpactById)

export default router;