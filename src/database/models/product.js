export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceData: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('priceData') || '{}'
        return JSON.parse(rawValue)
      },
      set(value) {
        this.setDataValue('priceData', JSON.stringify(value))
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NG',
      validate: {
        isIn: ['NG', 'US', 'UK'],
      },
    },
  })
  Product.associate = function (models) {
    models.Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
    })
    models.Product.belongsTo(models.Category, {
      foreignKey: 'subCategoryId',
    })
    models.Product.hasMany(models.ListContent, {
      foreignKey: 'productId',
    })
  }

  return Product
}
