import { ForbiddenError } from '../../utils/Errors.js'

export default (role = '') =>
  async (req, res, next) => {
    if (req.user.role !== role) {
      next(
        new ForbiddenError(
          `Forbidden route. Only a ${role} can access this route.`
        )
      )
    }

    return next()
  }
