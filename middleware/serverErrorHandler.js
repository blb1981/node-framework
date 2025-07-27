const { devMode } = require('../config/constants')

const serverErrorHandler = (err, req, res, next) => {
  if (devMode) {
    console.log(err.stack)
  }
  res.status(500)
  res.render('errors/serverError', { error: devMode ? err : {} })
}

module.exports = { serverErrorHandler }
