const { body } = require('express-validator')

const loginValidators = [
  body('email')
    .notEmpty()
    .withMessage('Please provide an email address')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.'),

  body('password').notEmpty().withMessage('Please provide a password'),
]

module.exports = { loginValidators }
