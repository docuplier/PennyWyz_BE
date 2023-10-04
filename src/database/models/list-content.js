export default (sequelize, DataTypes) => {
  const ListContent = sequelize.define('ListContent', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  })
  ListContent.associate = function (models) {
    models.ListContent.belongsTo(models.List, {
      foreignKey: 'listId',
    })
    models.ListContent.belongsTo(models.Product, {
      foreignKey: 'productId',
    })
  }

  return ListContent
}
