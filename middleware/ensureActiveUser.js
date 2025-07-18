// Make sure user is active
const ensureActiveUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next()
  }

  if (req.user && !req.user.active) {
    req.logout(() => {
      req.flash('error', 'Account is inactive.')
      res.redirect('/login')
    })
    return
  }
  next()
}

module.exports = { ensureActiveUser }
