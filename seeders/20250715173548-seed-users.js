'use strict'

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync('asdf', salt)

    // Save user to database
    return await queryInterface.bulkInsert('users', [
      {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@aol.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'GlobalAdmin',
        email: 'admin@aol.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    return await queryInterface.bulkDelete('users', null, {})
  },
}
