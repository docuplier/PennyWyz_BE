import { Router } from 'express'
import * as transactionController from '../controllers/transaction.controller.js'
import validateTransaction from '../middlewares/validator/transaction.js'
import requestFor from '../middlewares/auth/checkAuthorization.js'
import { USER_ROLES } from '../config/constants.js'

const router = Router()

router.post(
  '/buy',
  requestFor(USER_ROLES.BUYER),
  validateTransaction('buy'),
  transactionController.buy
)

router.get('/reset', requestFor(USER_ROLES.BUYER), transactionController.reset)

router.post(
  '/deposit',
  requestFor(USER_ROLES.BUYER),
  validateTransaction('deposit'),
  transactionController.deposit
)

export default router
