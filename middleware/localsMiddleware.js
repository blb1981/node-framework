const { devMode } = require('../config/constants')

const localsMiddleware = (req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.warning = req.flash('warning')
  res.locals.info = req.flash('info')
  res.locals.errors = []
  res.locals.oldInput = {}
  res.locals.devMode = devMode
  next()
}

module.exports = { localsMiddleware }
