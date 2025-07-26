const crypto = require('crypto')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const { validationResult, matchedData } = require('express-validator')

/** @type {typeof import('../models/User').User} */
const User = require('../models').User

const { sendPasswordResetEmail } = require('../email')
const { asyncHandler } = require('../utils/asyncHandler')

const showForgotPasswordForm = (req, res) => {
  res.render('forgotPassword/forgotForm')
}

const handleForgotPasswordForm = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  const validated = matchedData(req)

  if (!errors.isEmpty()) {
    return res.render('forgotPassword/forgotForm', {
      errors: errors.array({ onlyFirstError: true }),
    })
  }

  const user = await User.findOne({ where: { email: validated.email } })

  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 1000 * 60 * 15)

    user.passwordResetToken = token
    user.passwordResetTokenExpiry = expiry

    await user.save()

    // Send email
    const domain = process.env.APP_DOMAIN
    const resetLink = `${domain}/reset-password/${token}`
    await sendPasswordResetEmail(user.email, resetLink)
  }

  // Always redirect whether user exists or not
  res.redirect('/check-email')
})

const showCheckEmailPage = (req, res) => {
  res.render('forgotPassword/checkEmail')
}

const showResetPasswordForm = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    where: {
      passwordResetToken: req.params.token,
      passwordResetTokenExpiry: { [Op.gt]: new Date() },
    },
  })

  if (!user) {
    req.flash('error', 'Link expired')
    return res.redirect('/forgot-password')
  }

  res.render('forgotPassword/resetForm', { token: req.params.token })
})

const handleResetPasswordForm = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  const validated = matchedData(req)

  if (!errors.isEmpty()) {
    return res.render('forgotPassword/resetForm', {
      token: validated.token,
      errors: errors.array({ onlyFirstError: true }),
    })
  }

  const user = await User.findOne({
    where: {
      passwordResetToken: validated.token,
      passwordResetTokenExpiry: { [Op.gt]: new Date() },
    },
  })

  if (!user) {
    req.flash('error', 'Link expired')
    return res.redirect('/forgot-password')
  }

  user.password = await bcrypt.hash(validated.password, 10)
  user.passwordResetToken = null
  user.passwordResetTokenExpiry = null

  await user.save()
  req.flash('success', 'Password changed. Please login.')
  res.redirect('/login')
})

module.exports = {
  forgotPasswordController: {
    showForgotPasswordForm,
    handleForgotPasswordForm,
    showCheckEmailPage,
    showResetPasswordForm,
    handleResetPasswordForm,
  },
}
