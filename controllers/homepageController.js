const show = (req, res) => {
  res.render('homepage')
}

module.exports = { homepageController: { show } }
