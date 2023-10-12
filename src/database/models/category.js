export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Category.associate = function (models) {
    models.Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
    });
    models.Category.hasMany(models.Product, {
      foreignKey: 'subCategoryId',
    });
  };

  return Category;
};
