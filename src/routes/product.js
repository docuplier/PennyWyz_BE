import { Router } from 'express'
import * as productController from '../controllers/product.controller.js'
import validateProduct from '../middlewares/validator/product.js'
import requestFor from '../middlewares/auth/checkAuthorization.js'
import { USER_ROLES } from '../config/constants.js'

const router = Router()

router
  .route('/')
  .get(
    validateProduct('listQueryParams'),
    productController.listSelectedProducts
  )
  .post(
    requestFor(USER_ROLES.SELLER),
    validateProduct('create'),
    productController.createAProduct
  )

router
  .route('/:id')
  .get(validateProduct('checkId'), productController.getOne)
  .put(
    requestFor(USER_ROLES.SELLER),
    validateProduct('checkId'),
    validateProduct('update'),
    productController.updateAProduct
  )
  .delete(
    requestFor(USER_ROLES.SELLER),
    validateProduct('checkId'),
    productController.deleteAProduct
  )

export default router
