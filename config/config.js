require('dotenv').config({ quiet: true })
const { devMode } = require('./constants')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_NAME,
    logging: devMode && console.log,
  },
  // test: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_test',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
}
