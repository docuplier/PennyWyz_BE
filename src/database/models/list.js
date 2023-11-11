import constants from '../../config/constants.js';

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
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: constants.SUPPORTED_COUNTRIES[0],
      validate: {
        isIn: [constants.SUPPORTED_COUNTRIES],
      },
    },
  });
  List.associate = function associate(models) {
    models.List.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    models.List.hasMany(models.ListContent, {
      foreignKey: 'listId',
    });
  };

  return List;
};
