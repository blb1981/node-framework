const bcrypt = require('bcrypt')

/** @type {typeof import('../models/User').User} */
const User = require('../models').User
const { validationResult, matchedData } = require('express-validator')
const { asyncHandler } = require('../utils/asyncHandler')
const { getDateAndTime } = require('../utils/dates')

const index = asyncHandler(async (req, res) => {
  const users = await User.findAll()
  res.render('admin/users', { users })
})

const show = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  const userInfo = user.toJSON()
  userInfo.createdAt = getDateAndTime(userInfo.createdAt)
  userInfo.updatedAt = getDateAndTime(userInfo.updatedAt)
  res.render('admin/users/show', { userInfo })
})

const edit = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  const userInfo = user.toJSON()
  res.render('admin/users/edit', { userInfo })
})

const update = asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  const userId = parseInt(req.params.id)
  const validated = matchedData(req, { onlyValidData: true })
  const currentUserId = req.user.id

  const user = await User.findByPk(userId)

  if (!user) {
    req.flash('error', 'User not found')
    return res.redirect('/admin/users')
  }

  // Get active value, convert to boolean
  // If checkbox is checked, value comes in as array due to hidden field.
  const isActive =
    validated.active !== undefined
      ? Array.isArray(validated.active)
        ? validated.active[validated.active.length - 1] === 'true'
        : validated.active === 'true'
      : user.active // fallback if field was missing

  // Is user deactivating an account?
  const isDeactivating = !isActive

  // Re-render with any validation errors
  if (!errors.isEmpty()) {
    return res.render('admin/users/edit', {
      errors: errors.array({ onlyFirstError: true }),
      userInfo: user.toJSON(),
    })
  }

  // If email input has changed, check to verify email does not already exist
  const existingEmail = await User.findOne({
    where: { email: validated.email },
  })
  if (validated.email !== user.email && existingEmail) {
    errors = [{ msg: 'Email is alrady registered' }]
    return res.render('admin/users/edit', {
      errors,
      userInfo: user.toJSON(),
    })
  }

  // Prevent deactivating your own account
  if (currentUserId === user.id && isDeactivating) {
    req.flash('error', 'You cannot deactivate your own account.')
    return res.redirect(`/admin/users/${req.params.id}`)
  }

  // Prevent deactivating the last active admin
  if (user.role === 'admin' && isDeactivating) {
    const adminCount = await User.count({
      where: { role: 'admin', active: true },
    })

    if (adminCount <= 1) {
      req.flash('error', 'You cannot deactivate the last active admin.')
      return res.redirect(`/admin/users/${req.params.id}`)
    }
  }

  // Prevent self-demotion
  if (currentUserId !== user.id && validated.role) {
    user.role = validated.role
  }

  user.active = isActive
  user.firstName = validated.firstName
  user.lastName = validated.lastName
  user.email = validated.email
  user.role = validated.role

  if (validated.password) {
    const hashedPassword = await bcrypt.hash(validated.password, 10)
    user.password = hashedPassword
  }
  await user.save()

  // Log user out if they changed their own password
  const userUpdatedOwnPassword = currentUserId === user.id && validated.password
  if (userUpdatedOwnPassword) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error after password change:', err)
        req.flash('error', 'Password changed, but logout failed.')
        return res.redirect(`/admin/users/${user.id}`)
      }
      req.flash('info', 'Your password was changed. Please log in again.')
      return res.redirect('/login')
    })
    return
  }

  req.flash('success', 'User information saved successfully')
  res.redirect(`/admin/users/${user.id}`)
})

module.exports = { userController: { index, show, edit, update } }
