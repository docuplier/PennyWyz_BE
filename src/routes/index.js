import { Router } from 'express'
import productRoutes from './product.js'
import userRoutes from './user.js'

const router = Router()

router.use('/products', productRoutes)
router.use('/users', userRoutes)

router.get('/', (req, res) => res.sendStatus(200))
// eslint-disable-next-line no-unused-vars
router.all('*', (req, res, next) => res.sendStatus(404))

export default router
