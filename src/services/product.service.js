import model from '../database/models/index.js'
import {
  ResourceConflictError,
  ResourceNotFoundError,
} from '../utils/Errors.js'
import getUniqueId from '../utils/getUniqueId.js'

const { Op } = model.Sequelize

const parse = (queryParams) => {
  let filter = { where: {} }

  if (queryParams.sellerId) filter.where.sellerId = queryParams.sellerId
  if (queryParams.productName)
    filter.where.productName = {
      [Op.iLike]: '%' + queryParams.productName + '%',
    }

  return filter
}

export const createAProduct = async (data, sellerId) => {
  const checkDuplicate = await model.Product.findOne({
    where: { productName: { [Op.iLike]: data.productName } },
  })
  if (checkDuplicate) {
    throw new ResourceConflictError(
      `Product, with productName: ${data.productName}, already exists.`
    )
  }

  const id = await getUniqueId((id) => model.Product.findByPk(id))
  const newProduct = await model.Product.create({
    ...data,
    id,
    sellerId,
  })

  return newProduct
}

export const updateAProduct = async (id, updateData, sellerId) => {
  let data = {
    productName: updateData.productName,
    amountAvailable: updateData.amountAvailable,
    cost: updateData.cost,
  }
  if (data.productName) {
    const checkDuplicate = await model.Product.findOne({
      where: {
        productName: { [Op.iLike]: data.productName },
        id: { [Op.ne]: id },
      },
    })
    if (checkDuplicate) {
      throw new ResourceConflictError(
        `Product, with productName: ${updateData.productName}, already exists.`
      )
    }
  }

  const result = await model.Product.update(data, { where: { id, sellerId } })
  const affectedRecordCount = result[0]
  if (!affectedRecordCount)
    throw new ResourceNotFoundError('Product record not found.')

  return true
}

export const deleteAProduct = async (id, sellerId) => {
  const isDeleted = await model.Product.destroy({ where: { id, sellerId } })
  if (!isDeleted) throw new ResourceNotFoundError('Product record not found.')

  return true
}

export const getOneProduct = async (id) => {
  const savedRecord = await model.Product.findByPk(id)
  if (!savedRecord) throw new ResourceNotFoundError('Product record not found.')

  return savedRecord
}

export const listSelectedProducts = async (query) => {
  const findOption = parse(query)
  const productList = await model.Product.findAll(findOption)

  return productList
}
