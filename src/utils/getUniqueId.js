import crypto from 'crypto'
import constants from '../config/constants.js'

const createShortId = async (length = constants.ID_LENGTH) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz$1234567890'
  let token = []

  while (length > 0) {
    let index = await crypto.randomInt(characters.length)
    token.push(characters[index])
    length--
  }
  return token.join('')
}

/**
 * Generates a unique Id for the concerned entity.
 * @param {Promise} conditionPromise
 * @param {number} size
 * @returns uniqueId
 */
export default async (conditionPromise, size = constants.ID_LENGTH) => {
  let id = await createShortId(size)
  while (await conditionPromise(id)) {
    id = await createShortId(size)
  }

  return id
}
