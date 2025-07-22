const { body } = require('express-validator')

const userValidators = [
  body('_csrf').notEmpty(),
  body('active')
    .isBoolean({ loose: true })
    .withMessage('Active must be true or false'),
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

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Invalid role selection.'),

  body('password')
    .if(body('password').trim().notEmpty())
    .isLength({ min: parseInt(process.env.MIN_PASSWORD_LENGTH) })
    .withMessage(
      `Password must be at least ${process.env.MIN_PASSWORD_LENGTH} characters`
    ),

  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    })
    .withMessage('Passwords do not match'),
]

module.exports = { userValidators }
