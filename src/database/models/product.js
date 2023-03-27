export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amountAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        isMultipleOf5(value) {
          if (parseInt(value) % 5 !== 0) {
            throw new Error(
              'Only values, which are multiples of 5, are allowed!'
            )
          }
        },
      },
    },
  })
  Product.associate = function (models) {
    models.Product.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
    })
    models.Product.hasMany(models.Transaction, {
      foreignKey: 'productId',
    })
  }

  return Product
}
