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
    check('name')
      .trim()
      .notEmpty()
      .withMessage('name is required')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'name must be in a string format with at least 3 characters.',
      ),
    check('country')
      .trim()
      .notEmpty()
      .withMessage('country is required')
      .isString()
      .isIn(constants.SUPPORTED_COUNTRIES)
      .withMessage(
        `country must be in ${constants.SUPPORTED_COUNTRIES.join(', ')}.`,
      ),
  ],
  update: [
    check('name')
      .trim()
      .notEmpty()
      .withMessage('name can not be empty')
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        'name must be in a string format with at least 3 characters.',
      ),
  ],
  getAll: [
    check('country')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('country can not be empty.')
      .isString()
      .isIn(constants.SUPPORTED_COUNTRIES)
      .withMessage(
        `country must be in ${constants.SUPPORTED_COUNTRIES.join(', ')}.`,
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
};

export default (routeValidation) => [
  validationRules[routeValidation],
  validate,
];
