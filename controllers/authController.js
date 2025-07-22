const passport = require('passport')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
/** @type {typeof import('../models/User').User} */
const User = require('../models').User

const { asyncHandler } = require('../utils/asyncHandler')
const { devMode } = require('../config/constants')
const { sendWelcomeEmail } = require('../email')

const showRegister = (req, res) => {
  res.render('auth/register', { errors: [], oldInput: {} })
}

const handleRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      errors: errors.array({ onlyFirstError: true }),
      oldInput: { firstName, lastName, email },
    })
  }
  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      errors.push({ msg: 'Email is alrady registered' })
      return res.render('auth/register', {
        errors: errors.array({ onlyFirstError: true }),
        oldInput: { firstName, lastName, email },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    await sendWelcomeEmail(user)

    req.flash('success', 'Account created successfully. Please log in.')
    res.redirect('/login')
  } catch (error) {
    devMode && console.log(error)
    req.flash('error', 'An error occurred.')
    res.redirect('/register')
  }
})

const showLogin = (req, res) => {
  res.render('auth/login', { errors: [] })
}

const handleLogin = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash(
      'error',
      errors.array({ onlyFirstError: true }).map((e) => e.msg)
    )
    return res.redirect('/login')
  }

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
  })(req, res, next)
}

const handleLogout = (req, res) => {
  req.logout(() => {
    req.flash('info', 'Logged out')
    res.redirect('/login')
  })
}

module.exports = {
  authController: {
    showRegister,
    handleRegister,
    showLogin,
    handleLogin,
    handleLogout,
  },
}
