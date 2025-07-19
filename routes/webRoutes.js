const express = require('express')
const router = express.Router()

// Controllers
const { adminDashboardController } = require('../controllers/adminDashboardController')
const { authController } = require('../controllers/authController')
const { dashboardController } = require('../controllers/dashboardController')
const { homepageController } = require('../controllers/homepageController')
const { sessionController } = require('../controllers/sessionController')
const { userController } = require('../controllers/userController')

// Middleware
const { redirectIfAuthenticated } = require('../middleware/redirectIfAuthenticated')
const { ensureActiveUser } = require('../middleware/ensureActiveUser')
const { ensureAdmin } = require('../middleware/ensureAdmin')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

// Validators
const { loginValidators } = require('../validators/loginValidators')
const { registerValidators } = require('../validators/registerValidators')

// Homepage/frontend pages
router.get('/', homepageController.show)

// Registration/Auth routes
router.get('/register', redirectIfAuthenticated, authController.showRegister)
router.post('/register', redirectIfAuthenticated, registerValidators, authController.handleRegister)
router.get('/login', redirectIfAuthenticated, authController.showLogin)
router.post('/login', redirectIfAuthenticated, loginValidators, authController.handleLogin)

// Routes that require auth and active accounts
router.get('/dashboard', ensureAuthenticated, ensureActiveUser, dashboardController.show)
router.post('/logout', ensureAuthenticated, ensureActiveUser, authController.handleLogout)

// Admin routes
router.get('/admin', ensureAuthenticated, ensureActiveUser, ensureAdmin, adminDashboardController.show)
router.get('/admin/users', ensureAuthenticated, ensureActiveUser, ensureAdmin, userController.index)
router.get('/admin/users/:id', ensureAuthenticated, ensureActiveUser, ensureAdmin, userController.show)
router.post(
  '/admin/users/status/:id',
  ensureAuthenticated,
  ensureActiveUser,
  ensureAdmin,
  userController.toggleActiveStatus
)
router.get('/admin/logged-in-users', ensureAuthenticated, ensureActiveUser, ensureAdmin, sessionController.index)

module.exports = { webRoutes: router }
