const show = (req, res) => {
  res.render('admin/adminDashboard')
}
module.exports = { adminDashboardController: { show } }
