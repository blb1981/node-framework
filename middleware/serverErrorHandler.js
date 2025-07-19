const { devMode } = require('../config/constants')

const serverErrorHandler = (err, req, res, next) => {
  console.error(devMode && err.stack)
  res.status(500)
  res.render('errors/serverError', { error: devMode ? err : {} })
}

// TODO: This needs fixed

module.exports = { serverErrorHandler }
