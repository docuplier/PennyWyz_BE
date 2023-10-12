import { check } from 'express-validator';
import validate from './baseValidator.js';
import constants from '../../config/constants.js';

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
    check('email')
      .trim()
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('Invalid email.'),
    check('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('firstName can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'firstNname must be in a string format with at least 3 characters.',
      ),
    check('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('lastName can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'lastName must be in a string format with at least 3 characters.',
      ),
    check('password')
      .trim()
      .notEmpty()
      .withMessage('password is required.')
      .isString()
      .isLength({ min: 6 })
      .withMessage('password must be a string with at least 6 characters.'),
  ],
  login: [
    check('email')
      .trim()
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('Invalid email.'),
    check('password')
      .trim()
      .notEmpty()
      .withMessage('password is required.')
      .isString()
      .isLength({ min: 6 })
      .withMessage('password must be a string with at least 6 characters.'),
  ],
  update: [
    check('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('firstName can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'firstNname must be in a string format with at least 3 characters.',
      ),
    check('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('lastName can not be empty.')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'lastName must be in a string format with at least 3 characters.',
      ),
  ],
};

export default (routeValidation) => [
  validationRules[routeValidation],
  validate,
];
