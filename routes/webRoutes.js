const express = require('express')
const router = express.Router()

const { authController } = require('../controllers/authController')

// Middleware
const {
  redirectIfAuthenticated,
} = require('../middleware/redirectIfAuthenticated')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

// TODO: Validators

router.get('/', (req, res) => {
  res.render('homepage') // TODO: Add controller for this??
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard') // TODO: Add controller for this??
})

// Registration/Auth routes
router.get('/register', redirectIfAuthenticated, authController.showRegister)
router.post('/register', redirectIfAuthenticated, authController.handleRegister)
router.get('/login', redirectIfAuthenticated, authController.showLogin)
router.post('/login', redirectIfAuthenticated, authController.handleLogin)
router.post('/logout', ensureAuthenticated, authController.handleLogout)

module.exports = { webRoutes: router }
