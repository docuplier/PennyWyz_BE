/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
import crypto from 'crypto';
import constants from '../config/constants.js';

const createShortId = (length = constants.ID_LENGTH) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz$1234567890';
  const token = [];

  while (length > 0) {
    const index = crypto.randomInt(characters.length);
    token.push(characters[index]);
    length -= 1;
  }
  return token.join('');
};

/**
 * Generates a unique Id for the concerned entity.
 * @param {Promise} conditionPromise
 * @param {number} size
 * @returns uniqueId
 */
export default async (conditionPromise, size = constants.ID_LENGTH) => {
  let id = createShortId(size);
  while (await conditionPromise(id)) {
    id = createShortId(size);
  }

  return id;
};
