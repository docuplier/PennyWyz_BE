import { USER_ROLES } from '../../config/constants.js'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'seller',
      validate: {
        isIn: [Object.values(USER_ROLES)],
      },
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  })
  User.associate = function (models) {
    models.User.hasMany(models.Token, {
      foreignKey: 'userId',
    })
    models.User.hasMany(models.Product, {
      foreignKey: 'sellerId',
    })
    models.User.hasMany(models.Transaction, {
      foreignKey: 'userId',
    })
  }

  return User
}
