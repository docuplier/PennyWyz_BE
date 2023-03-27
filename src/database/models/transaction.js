import { TRANSACTION_TYPES } from '../../config/constants.js'

export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(TRANSACTION_TYPES)],
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
    },
    {
      paranoid: true,
    }
  )
  Transaction.associate = function (models) {
    models.Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
    })
    models.Transaction.belongsTo(models.Product, {
      foreignKey: 'productId',
    })
  }

  return Transaction
}
