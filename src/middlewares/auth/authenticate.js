import { UnauthorizedError } from '../../utils/Errors.js'
import { verifyToken } from '../../services/token.service.js'

export default async (req, res, next) => {
  try {
    if (!req.headers['authorization']) throw new Error()

    const tokenArray = req.headers['authorization'].split(' ')
    if (tokenArray[0] !== 'Bearer') throw new Error()

    const token = tokenArray[1]
    if (!token) throw new Error()

    const tokenUser = await verifyToken(token)
    if (!tokenUser) throw new Error()

    req.user = tokenUser.dataValues

    next()
  } catch (error) {
    next(new UnauthorizedError('User not authenticated.'))
  }
}
