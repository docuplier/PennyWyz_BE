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
  deposit: [
    check('amount')
      .notEmpty()
      .withMessage('amount is required')
      .isInt()
      .isIn(constants.ACCEPTED_COINS)
      .withMessage(
        `amount must be one of these: ${constants.ACCEPTED_COINS.join(', ')}.`
      ),
  ],
  buy: [
    check('productId')
      .trim()
      .notEmpty()
      .withMessage('productId is required.')
      .isString()
      .isLength({ min: constants.ID_LENGTH, max: constants.ID_LENGTH })
      .withMessage(
        `productId must be a string of ${constants.ID_LENGTH} characters.`
      ),
    check('quantity')
      .notEmpty()
      .withMessage('quantity is required')
      .isInt({ min: 0 })
      .withMessage('quantity must be an integer.'),
  ],
}

export default (routeValidation) => [
  validationRules[routeValidation],
  validate,
]
