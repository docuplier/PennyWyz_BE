import { Router } from 'express';
import listContentRoutes from './list-content.js';
import listRoutes from './list.js';
import productRoutes from './product.js';
import userRoutes from './user.js';
import authenticate from '../middlewares/auth/authenticate.js';

const router = Router();

router.use('/list-contents', authenticate, listContentRoutes);
router.use('/lists', authenticate, listRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);

router.get('/', (req, res) => res.sendStatus(200));
// eslint-disable-next-line no-unused-vars
router.all('*', (req, res, next) => res.sendStatus(404));

export default router;
