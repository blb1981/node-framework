require('dotenv').config({ quiet: true })
const { devMode } = require('./constants')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_NAME,
    logging: devMode && console.log,
  },
  staging: {
    dialect: 'sqlite',
    storage: process.env.DB_NAME,
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    storage: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
}
