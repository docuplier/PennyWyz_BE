export default {
  development: {
    username: 'comurule',
    password: null,
    database: 'vending',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'comurule',
    password: null,
    database: 'vending',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
  },
}
