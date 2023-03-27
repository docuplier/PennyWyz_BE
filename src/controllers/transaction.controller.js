import * as transactionService from '../services/transaction.service.js'

export const deposit = async (req, res, next) => {
  try {
    const { amount } = req.body
    const result = await transactionService.deposit(req.user.id, amount)
    return res.status(200).json({
      status: 'success',
      message: 'Amount deposited successfully.',
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const buy = async (req, res, next) => {
  try {
    const payload = {
      quantity: req.body.quantity,
      productId: req.body.productId,
      userId: req.user.id,
    }
    const result = await transactionService.buyProduct(payload)
    return res.status(200).json({
      status: 'success',
      message: `Purchase done successfully.`,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const reset = async (req, res, next) => {
  try {
    await transactionService.resetDeposit(req.user.id)
    return res.status(200).json({
      status: 'success',
      message: `User deposit reset successfully.`,
    })
  } catch (error) {
    return next(error)
  }
}
