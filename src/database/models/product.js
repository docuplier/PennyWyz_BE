export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceRange: {
      type: DataTypes.STRING,
      allowNull: false,
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
