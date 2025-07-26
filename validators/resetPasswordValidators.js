const { body } = require('express-validator')

const resetPasswordValidators = [
  body('token').notEmpty(),

  body('password')
    .notEmpty()
    .withMessage('Please enter a valid password')
    .bail()
    .isLength({ min: parseInt(process.env.MIN_PASSWORD_LENGTH) })
    .withMessage(
      `Password must be at least ${process.env.MIN_PASSWORD_LENGTH} characters`
    ),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('Please confirm your password')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    })
    .withMessage('Passwords do not match'),
]

module.exports = { resetPasswordValidators }
