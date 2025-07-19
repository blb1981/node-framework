/** @type {typeof import('../models/User').User} */
const User = require('../models').User
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

const toggleActiveStatus = asyncHandler(async (req, res) => {
  const returnTo = req.body.returnTo || '/dashboard'
  const user = await User.findByPk(req.params.id)

  // User cannot deactivate their own account.
  if (req.user.id == req.params.id) {
    req.flash('error', 'Cannot deactivate your own account')
    return res.redirect('/admin/users')
  }
  user.active = !user.active
  await user.save()
  req.flash('info', 'User status toggled successfully')
  res.redirect(returnTo)
})

module.exports = { userController: { index, toggleActiveStatus, show } }
