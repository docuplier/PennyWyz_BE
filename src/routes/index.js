import { Router } from 'express'
import authenticate from '../middlewares/auth/authenticate.js'
import productRoutes from './product.js'
import userRoutes from './user.js'
import trxRoutes from './transaction.js'

const router = Router()

router.use('/products', authenticate, productRoutes)
router.use('/users', userRoutes)
router.use('/transactions', authenticate, trxRoutes)

router.get('/', (req, res) => res.sendStatus(200))
// eslint-disable-next-line no-unused-vars
router.all('*', (req, res, next) => res.sendStatus(404))

export default router
