const show = (req, res) => {
  res.render('dashboard')
}

module.exports = { dashboardController: { show } }
