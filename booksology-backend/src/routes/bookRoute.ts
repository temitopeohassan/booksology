import express from 'express';
import { getBooks, getBookDetails, purchaseBook } from '../controllers/bookController';
import {
  Request,
  Response,
  NextFunction
} from 'express';

const router = express.Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(getBooks));
router.get('/:id', asyncHandler(getBookDetails));
router.post('/:id/purchase', asyncHandler(purchaseBook));

export default router;