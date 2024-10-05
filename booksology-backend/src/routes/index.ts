import { Router } from 'express';
import bookRoutes from './bookRoute';  // Changed from './bookRoutes'
import userRoutes from './userRoute';  // Changed from './userRoutes'

const router = Router();

router.use('/books', bookRoutes);
router.use('/users', userRoutes);

export default router;