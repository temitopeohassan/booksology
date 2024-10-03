import { Router } from 'express';
import bookRoutes from './bookRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/users', userRoutes);

export default router;