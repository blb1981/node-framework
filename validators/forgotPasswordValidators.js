const { body } = require('express-validator')

const forgotPasswordValidators = [
  body('email')
    .notEmpty()
    .withMessage('Email address is empty.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail()
    .normalizeEmail(),
]

module.exports = { forgotPasswordValidators }
