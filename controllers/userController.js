/** @type {typeof import('../models/User').User} */
const User = require('../models').User

const index = async (req, res) => {
  const users = await User.findAll()
  res.render('admin/users', { users })
}

const toggleStatus = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  // Verify user is not trying to delete their own account
  if (req.user.id == req.params.id) {
    req.flash('error', 'Cannot delete your own account')
    return res.redirect('/admin/users')
  }
  user.active = !user.active
  await user.save()
  req.flash('info', 'User status toggled successfully')
  res.redirect('/admin/users')
}

module.exports = { userController: { index, toggleStatus } }
