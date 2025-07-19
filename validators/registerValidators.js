const { body } = require('express-validator')

const registerValidators = [
  body('_csrf').notEmpty(),
  body('firstName').notEmpty().withMessage('Please enter a first name').trim(),

  body('lastName').trim(),

  body('email')
    .notEmpty()
    .withMessage('Email address is empty.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail()
    .normalizeEmail(),

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

module.exports = { registerValidators }
