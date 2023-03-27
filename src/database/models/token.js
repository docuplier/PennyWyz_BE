export default (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Token',
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      paranoid: true,
    }
  )
  Token.associate = function (models) {
    models.Token.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    })
  }

  return Token
}
