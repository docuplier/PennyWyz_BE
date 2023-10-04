export default (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })
  List.associate = function (models) {
    models.List.belongsTo(models.User, {
      foreignKey: 'userId',
    })
    models.List.hasMany(models.ListContent, {
      foreignKey: 'listId',
    })
  }

  return List
}
