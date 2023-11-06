import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import validateProduct from '../middlewares/validator/product.js';

const router = Router();

router.route('/').get(validateProduct('listQueryParams'), productController.listSelectedProducts);

export default router;
