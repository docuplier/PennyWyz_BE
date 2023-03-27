import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import validateUser from '../middlewares/validator/user.js'
import authenticate from '../middlewares/auth/authenticate.js'
import rateLimit from '../middlewares/rateLimiter.js'

const router = Router()

router.post(
  '/login',
  rateLimit,
  validateUser('login'),
  userController.loginAUser
)
router.get('/logout/all', authenticate, userController.logoutAllTokens)

router
  .route('/')
  .get(authenticate, userController.listSelectedUsers)
  .post(validateUser('create'), userController.registerAUser)
  .put(validateUser('update'), authenticate, userController.updateUserProfile)
  .delete(authenticate, userController.deleteUserProfile)

router
  .route('/:id')
  .get(validateUser('checkId'), authenticate, userController.getOne)

export default router
