import Sequelize from 'sequelize';
import * as models from './models.js';
import enVariables from '../../config/dbConfig.js';

const env = process.env.NODE_ENV || 'development';
const config = enVariables[env];
const db = {};

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: false,
    multipleStatements: true,
  },
);

Object.keys(models).forEach((file) => {
  const model = models[file](connection, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.connection = connection;
db.Sequelize = Sequelize;

export default db;
