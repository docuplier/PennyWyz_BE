import jwt from 'jsonwebtoken'
import model from '../database/models/index.js'
import constants from '../config/constants.js'

const { Op } = model.Sequelize

export const generateToken = async (userId) => {
  const token = jwt.sign({ id: userId }, constants.JWT_SECRET, {
    expiresIn: constants.JWT_EXPIRESIN,
  })
  await model.Token.create({ token, userId })

  return token
}

export const getActiveLoginCount = async (userId) => {
  const expiredTimeFromNow = Date.now() - constants.JWT_EXPIRESIN
  return model.Token.count({
    where: {
      userId,
      createdAt: { [Op.gte]: expiredTimeFromNow },
    },
  })
}

export const verifyToken = async (token) => {
  const payload = await jwt.verify(token, constants.JWT_SECRET)
  if (!payload || !payload.id) return null
  if (payload.exp * 1000 <= Date.now()) return null

  const tokenWithUser = await model.Token.findOne({
    where: { token, userId: payload.id },
    include: [model.User],
  })
  if (!tokenWithUser) return null

  return tokenWithUser.User
}

export const blackListUserTokens = async (userId) => {
  const recordAffected = await model.Token.destroy({ where: { userId } })
  return recordAffected
}
