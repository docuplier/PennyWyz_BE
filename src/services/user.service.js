import model from '../database/models/index.js'
import * as tokenService from './token.service.js'
import getUniqueId from '../utils/getUniqueId.js'
import {
  ResourceConflictError,
  ResourceNotFoundError,
  ForbiddenError,
} from '../utils/Errors.js'
import { hashPassword, validatePassword } from '../utils/hash.js'

const { Op } = model.Sequelize
const parse = (queryParams) => {
  return {}
}

export const createAUser = async (data) => {
  const checkDuplicate = await model.User.findOne({
    where: { username: { [Op.iLike]: data.username } },
  })
  if (checkDuplicate) {
    throw new ResourceConflictError(
      `User, with username: ${data.username}, already exists.`
    )
  }

  const hashedPassword = await hashPassword(data.password)
  const id = await getUniqueId((id) => model.User.findByPk(id))
  const newUser = await model.User.create({
    username: data.username,
    role: data.role,
    password: hashedPassword,
    id,
  })

  const accessToken = await tokenService.generateToken(newUser.id)
  return {
    accessToken,
    user: {
      id: newUser.id,
      role: newUser.role,
      username: newUser.username,
    },
  }
}

export const loginAUser = async (credentials) => {
  try {
    const savedUser = await model.User.findOne({
      where: { username: { [Op.iLike]: credentials.username } },
    })
    if (!savedUser) throw new ForbiddenError()

    const isValidPassword = await validatePassword(
      credentials.password,
      savedUser.password
    )
    if (!isValidPassword) throw new ForbiddenError()

    const activeLoginCount = await tokenService.getActiveLoginCount(
      savedUser.id
    )
    const accessToken = await tokenService.generateToken(savedUser.id)
    return {
      activeLoginCount,
      accessToken,
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw new ForbiddenError('Invalid login credentials.')
    }
    throw error
  }
}

export const updateAUser = async (id, updateData) => {
  let data = {
    username: updateData.username,
    password: updateData.password,
    role: updateData.role,
  }
  if (data.role) {
    const hasProduct = await model.Product.findOne({ where: { sellerId: id } })
    if (hasProduct) {
      throw new ResourceConflictError(
        'Sellers, with Products, can not change roles. Kindly, delete all products attached to this User.'
      )
    }
  }
  if (data.username) {
    const checkDuplicate = await model.User.findOne({
      where: { username: { [Op.iLike]: data.username }, id: { [Op.ne]: id } },
    })
    if (checkDuplicate) {
      throw new ResourceConflictError(
        `User, with username: ${updateData.username}, already exists.`
      )
    }
  }
  if (data.password) {
    data.password = await hashPassword(data.password)
  }

  const result = await model.User.update(data, { where: { id } })
  const affectedRecordCount = result[0]
  if (!affectedRecordCount)
    throw new ResourceNotFoundError('User record not found.')

  return true
}

export const deleteAUser = async (id) => {
  const isDeleted = await model.User.destroy({ where: { id } })
  if (!isDeleted) throw new ResourceNotFoundError('User record not found.')

  return true
}

export const getOneUser = async (id, isUserProfile = false) => {
  const savedRecord = await model.User.findByPk(id)
  if (!savedRecord) throw new ResourceNotFoundError('User Record not Found')

  return {
    id: savedRecord.id,
    role: savedRecord.role,
    username: savedRecord.username,
    deposit: isUserProfile ? savedRecord.deposit : undefined,
  }
}

export const listSelectedUsers = async (query) => {
  const findOption = parse(query)
  const userList = await model.User.findAll(findOption)

  return userList.map((user) => ({
    id: user.id,
    role: user.role,
    username: user.username,
  }))
}

export const logoutAllTokens = async (id) => {
  const res = await tokenService.blackListUserTokens(id)
  return res > 0
}
