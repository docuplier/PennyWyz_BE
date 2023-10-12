import { validationResult } from 'express-validator';

/**
 * Reduces the validation array into an object like this <{[param]:ParamValidatorArray[]}>
 * @param {ValidationError[]} array
 * @returns
 */
const render = (array) => {
  const errObj = {};
  for (let i = 0; i < array.length; i += 1) {
    const err = array[i];
    if (errObj[err.param]) {
      errObj[err.param].push(err.msg);
    } else {
      errObj[err.param] = [err.msg];
    }
  }

  return errObj;
};

/**
 * Checks for Validation errors. If errors,
 * responds with errors Or moves to the next middleware in the Route chain
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @param {NextFunction} next - Next callback
 */
const validateInputs = async (req, res, next) => {
  // Checks for validation errors
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error(s)',
      data: render(errors.array()),
    });
  }

  return next();
};

export default validateInputs;
