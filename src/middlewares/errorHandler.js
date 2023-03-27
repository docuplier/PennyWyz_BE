import { ServerError, AppError } from '../utils/Errors.js'
import logger from '../utils/logger.js'

export default (err, req, res) => {
  if (err instanceof AppError) {
    return res.status(err.status).json(err.toJSON())
  }
  console.log({ err })
  let serverError
  if (process.env.NODE_ENV === 'production') {
    logger.error(err)
    serverError = new ServerError('Something went wrong. Try again later.')
  } else {
    serverError = new ServerError(err.message, err.stack)
  }

  res.status(serverError.status).json(serverError.toJSON(process.env.NODE_ENV))
  // return process.exit(0);
}
