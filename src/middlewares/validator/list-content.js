import { check, query } from 'express-validator';
import validate from './baseValidator.js';
import constants from '../../config/constants.js';

const validationRules = {
  checkId: [
    check('id')
      .trim()
      .notEmpty()
      .withMessage('ID is required.')
      .isInt({ min: 0 })
      .withMessage('ID must be an integer.'),
  ],
  create: [
    check('productId')
      .trim()
      .notEmpty()
      .withMessage('productId is required.')
      .isInt({ min: 0 })
      .withMessage('productId must be an integer.'),
    check('quantity')
      .trim()
      .notEmpty()
      .withMessage('quantity is required.')
      .isInt({ min: 0 })
      .withMessage('quantity must be an integer.'),
    check('listId')
      .trim()
      .notEmpty()
      .withMessage('listId is required.')
      .isString()
      .isLength({ min: constants.ID_LENGTH, max: constants.ID_LENGTH })
      .withMessage(`listId must be a string of ${constants.ID_LENGTH} characters.`),
  ],
  update: [
    check('quantity')
      .trim()
      .notEmpty()
      .withMessage('quantity is required.')
      .isInt({ min: 0 })
      .withMessage('quantity must be an integer.'),
    check('checked')
      .notEmpty()
      .withMessage('checked is required.')
      .isBoolean()
      .withMessage('checked must be boolean.'),
  ],
  getAll: [
    query('listId')
      .trim()
      .notEmpty()
      .withMessage('listId is required in the query params.')
      .isString()
      .isLength({ min: constants.ID_LENGTH, max: constants.ID_LENGTH })
      .withMessage(`listId must be a string of ${constants.ID_LENGTH} characters.`),
  ],
};

export default (routeValidation) => [
  validationRules[routeValidation],
  validate,
];
