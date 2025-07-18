const express = require('express')
const router = express.Router()

// Controllers
const {
  adminDashboardController,
} = require('../controllers/adminDashboardController')
const { authController } = require('../controllers/authController')
const { dashboardController } = require('../controllers/dashboardController')
const { sessionController } = require('../controllers/sessionController')
const { userController } = require('../controllers/userController')

// Middleware
const {
  redirectIfAuthenticated,
} = require('../middleware/redirectIfAuthenticated')
const { ensureActiveUser } = require('../middleware/ensureActiveUser')
const { ensureAdmin } = require('../middleware/ensureAdmin')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

// TODO: Validators

router.get('/', (req, res) => {
  res.render('homepage') // TODO: Add controller for this??
})

// Registration/Auth routes
router.get('/register', redirectIfAuthenticated, authController.showRegister)
router.post('/register', redirectIfAuthenticated, authController.handleRegister)
router.get('/login', redirectIfAuthenticated, authController.showLogin)
router.post('/login', redirectIfAuthenticated, authController.handleLogin)

// Routes that require auth and active accounts
router.use(ensureAuthenticated, ensureActiveUser)
router.get('/dashboard', dashboardController.show)
router.post('/logout', authController.handleLogout)

// Admin routes
router.use(ensureAdmin)
router.get('/admin', adminDashboardController.show)
router.get('/admin/users', userController.index)
router.post('/admin/users/status/:id', userController.toggleStatus)
router.get('/admin/logged-in-users', sessionController.index)

module.exports = { webRoutes: router }
