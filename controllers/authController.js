const passport = require('passport')
/** @type {typeof import('../models/User').User} */
const User = require('../models').User
const bcrypt = require('bcrypt')

const showRegister = (req, res) => {
  res.render('auth/register')
}

const handleRegister = async (req, res) => {
  // TODO: Registration validation
  const { firstName, lastName, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log({ firstName, lastName, email, password })
  try {
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    req.flash('success', 'Account created successfully. Please log in.')
    res.redirect('/login')
  } catch (error) {
    console.log(error)
    // TODO: Handle this appropriately. Add to errors array. Render register view with errors.
    req.flash('error', 'Email may already be taken')
    res.redirect('/register')
  }
}

const showLogin = (req, res) => {
  res.render('auth/login')
}

const handleLogin = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true,
})

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
