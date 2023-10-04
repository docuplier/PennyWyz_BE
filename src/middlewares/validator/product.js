import { check } from 'express-validator'
import validate from './baseValidator.js'
import constants from '../../config/constants.js'

const validationRules = {
  checkId: [
    check('id')
      .trim()
      .notEmpty()
      .withMessage('ID is required.')
      .isString()
      .isLength({ min: constants.ID_LENGTH, max: constants.ID_LENGTH })
      .withMessage(`ID must be a string of ${constants.ID_LENGTH} characters.`),
  ],
  create: [
    check('productName')
      .trim()
      .notEmpty()
      .withMessage('productName is required')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'productName must be in a string format with at least 3 characters.'
      ),
    check('cost')
      .notEmpty()
      .withMessage('cost is required.')
      .isInt({ min: 5 })
      .withMessage('cost must be an integer.')
      .custom((input) => input % 5 === 0)
      .withMessage('cost must be a multiple of 5.'),
    check('amountAvailable')
      .notEmpty()
      .withMessage('amountAvailable is required')
      .isInt({ min: 0 })
      .withMessage('amountAvailable must be an integer.'),
  ],
  update: [
    check('productName')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('productName can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'productName must be in a string format with at least 3 characters.'
      ),
    check('cost')
      .optional()
      .notEmpty()
      .withMessage('cost can not be empty.')
      .isInt({ min: 5 })
      .withMessage('cost must be an integer.')
      .custom((input) => input % 5 === 0)
      .withMessage('cost must be a multiple of 5.'),
    check('amountAvailable')
      .optional()
      .notEmpty()
      .withMessage('amountAvailable can not be empty')
      .isInt({ min: 0 })
      .withMessage('amountAvailable must be an integer.'),
  ],
  listQueryParams: [
    check('search')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('search can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'search must be in a string format with at least 3 characters.'
      ),
    check('limit')
      .optional()
      .notEmpty()
      .withMessage('limit can not be empty.')
      .isInt({ min: 0 })
      .withMessage('limit must be an integer not less than zero.'),
    check('page')
      .optional()
      .notEmpty()
      .withMessage('page can not be empty.')
      .isInt({ min: 0 })
      .withMessage('page must be an integer not less than zero.'),
  ],
}

export default (routeValidation) => [validationRules[routeValidation], validate]
