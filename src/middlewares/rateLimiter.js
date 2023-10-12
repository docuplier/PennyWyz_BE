import { TooManyRequestError } from '../utils/Errors.js';

let hash = {};
const isWithinSameSecond = (timeInMilliseconds) =>
  Date.now() - timeInMilliseconds <= 1000;

export default (req, res, next) => {
  if (hash[req.ip] && isWithinSameSecond(hash[req.ip])) {
    return next(
      new TooManyRequestError('This route is limited to 1 request per second.'),
    );
  }

  hash[req.ip] = Date.now();
  next();
};
