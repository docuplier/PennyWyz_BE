import model from '../database/models/index.js'
import constants, { TRANSACTION_TYPES } from '../config/constants.js'
import { UnprocessibleError, ResourceNotFoundError } from '../utils/Errors.js'

const parseDeposit = (amount) => {
  let amountLeft = amount
  const reducer = (res, coin) => {
    const multiplier = Math.floor(amountLeft / coin)
    const sum = multiplier * coin
    amountLeft -= sum
    res.push(sum)

    return res
  }
  return constants.ACCEPTED_COINS.reduce(reducer, []).reverse()
}

export const deposit = async (userId, amount) => {
  const result = await model.connection.transaction(async (t) => {
    await model.User.update(
      { deposit: model.Sequelize.literal(`"deposit" + ${amount}`) },
      {
        where: { id: userId },
        transaction: t,
      }
    )

    const newTransaction = await model.Transaction.create(
      {
        type: TRANSACTION_TYPES.DEPOSIT,
        amount,
        userId,
      },
      { transaction: t }
    )

    return newTransaction
  })

  return result
}

export const resetDeposit = async (userId) => {
  const result = await model.connection.transaction(async (t) => {
    await model.User.update(
      { deposit: 0 },
      {
        where: { id: userId },
        transaction: t,
      }
    )

    const newTransaction = await model.Transaction.create(
      {
        type: TRANSACTION_TYPES.RESET,
        amount: 0,
        userId,
      },
      { transaction: t }
    )

    return newTransaction
  })

  return result
}

export const buyProduct = async (payload) => {
  const result = await model.connection.transaction(async (t) => {
    const product = await model.Product.findByPk(payload.productId, {
      lock: true,
      transaction: t,
    })
    if (!product) throw new ResourceNotFoundError('Product record not found.')
    if (product.amountAvailable < payload.quantity) {
      throw new UnprocessibleError('Not enough product quantity available.')
    }

    const amount = payload.quantity * product.cost
    const buyer = await model.User.findByPk(payload.userId, {
      lock: true,
      transaction: t,
    })
    if (buyer.deposit < amount) {
      throw new UnprocessibleError('User deposit is too Low.')
    }

    product.amountAvailable -= payload.quantity
    buyer.deposit -= amount

    await Promise.all([
      buyer.save({ transaction: t }),
      product.save({ transaction: t }),
      model.Transaction.create(
        {
          type: TRANSACTION_TYPES.PURCHASE,
          amount,
          quantity: payload.quantity,
          productId: product.id,
          userId: payload.userId,
        },
        { transaction: t }
      ),
    ])

    return {
      totalAmount: amount,
      depositLeft: parseDeposit(buyer.deposit),
      product,
    }
  })

  return result
}
