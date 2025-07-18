const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }

  return res.redirect('/dashboard')
}

module.exports = { ensureAdmin }
