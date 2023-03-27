import { check } from 'express-validator'
import validate from './baseValidator.js'
import constants, { USER_ROLES } from '../../config/constants.js'

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
    check('username')
      .trim()
      .notEmpty()
      .withMessage('username is required')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'username must be in a string format with at least 3 characters.'
      ),
    check('password')
      .trim()
      .notEmpty()
      .withMessage('password is required.')
      .isString()
      .isLength({ min: 6 })
      .withMessage('password must be a string with at least 6 characters.'),
    check('role')
      .trim()
      .notEmpty()
      .withMessage('role is required')
      .isIn(Object.values(USER_ROLES))
      .withMessage(
        `role must be one of these: ${Object.values(USER_ROLES).join(', ')}`
      ),
  ],
  login: [
    check('username')
      .trim()
      .notEmpty()
      .withMessage('username is required')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'username must be in a string format with at least 3 characters.'
      ),
    check('password')
      .trim()
      .notEmpty()
      .withMessage('password is required.')
      .isString()
      .isLength({ min: 6 })
      .withMessage('password must be a string with at least 6 characters.'),
  ],
  update: [
    check('username')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('username can not be empty.')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'username must be in a string format with at least 3 characters.'
      ),
    check('password')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('password can not be empty.')
      .isString()
      .isLength({ min: 6 })
      .withMessage('password must be a string with at least 6 characters.'),
    check('role')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('role can not be empty.')
      .isIn(Object.values(USER_ROLES))
      .withMessage(
        `role must be one of these: ${Object.values(USER_ROLES).join(', ')}`
      ),
  ],
}

export default (routeValidation) => [validationRules[routeValidation], validate]
