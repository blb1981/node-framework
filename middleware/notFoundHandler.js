const notFoundHandler = (req, res, next) => {
  res.status(404)
  res.render('errors/notFound')
}
module.exports = { notFoundHandler }
