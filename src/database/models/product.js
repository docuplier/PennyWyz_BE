import constants from '../../config/constants.js';

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
        const rawValue = this.getDataValue('priceData') || '{}';
        return JSON.parse(rawValue);
      },
      set(value) {
        this.setDataValue('priceData', JSON.stringify(value));
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: constants.SUPPORTED_COUNTRIES[0],
      validate: {
        isIn: constants.SUPPORTED_COUNTRIES,
      },
    },
  });
  Product.associate = function associate(models) {
    models.Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
    });
    models.Product.belongsTo(models.Category, {
      foreignKey: 'subCategoryId',
    });
    models.Product.hasMany(models.ListContent, {
      foreignKey: 'productId',
    });
  };

  return Product;
};
