const express = require('express')
const router = express.Router()

// Controllers
const {
  adminDashboardController,
} = require('../controllers/adminDashboardController')
const { authController } = require('../controllers/authController')
const { dashboardController } = require('../controllers/dashboardController')
const {
  forgotPasswordController,
} = require('../controllers/forgotPasswordController')
const { homepageController } = require('../controllers/homepageController')
// const { sessionController } = require('../controllers/sessionController')
const { userController } = require('../controllers/userController')

// Middleware
const {
  redirectIfAuthenticated,
} = require('../middleware/redirectIfAuthenticated')
const { ensureActiveUser } = require('../middleware/ensureActiveUser')
const { ensureAdmin } = require('../middleware/ensureAdmin')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

// Validators
const {
  forgotPasswordValidators,
} = require('../validators/forgotPasswordValidators')
const { loginValidators } = require('../validators/loginValidators')
const { registerValidators } = require('../validators/registerValidators')
const {
  resetPasswordValidators,
} = require('../validators/resetPasswordValidators')
const { userValidators } = require('../validators/userValidators')

// Homepage/frontend pages
router.get('/', homepageController.show)

// Registration routes
router
  .route('/register')
  .all(redirectIfAuthenticated)
  .get(authController.showRegister)
  .post(registerValidators, authController.handleRegister)

// Login routes
router
  .route('/login')
  .all(redirectIfAuthenticated)
  .get(authController.showLogin)
  .post(redirectIfAuthenticated, loginValidators, authController.handleLogin)

// Forgot password routes
router.get('/forgot-password', forgotPasswordController.showForgotPasswordForm)
router.post(
  '/forgot-password',
  forgotPasswordValidators,
  forgotPasswordController.handleForgotPasswordForm
)
router.get('/check-email', forgotPasswordController.showCheckEmailPage)
router.get(
  '/reset-password/:token',
  forgotPasswordController.showResetPasswordForm
)
router.post(
  '/reset-password',
  resetPasswordValidators,
  forgotPasswordController.handleResetPasswordForm
)

// Routes that require auth and active accounts
router.get(
  '/dashboard',
  ensureAuthenticated,
  ensureActiveUser,
  dashboardController.show
)
router.post(
  '/logout',
  ensureAuthenticated,
  ensureActiveUser,
  authController.handleLogout
)

// Admin dashboard
router.get(
  '/admin',
  ensureAuthenticated,
  ensureActiveUser,
  ensureAdmin,
  adminDashboardController.show
)

// User administration
router.use('/admin/users', ensureAuthenticated, ensureActiveUser, ensureAdmin)
router.get('/admin/users', userController.index)
router.get('/admin/users/:id', userController.show)
router.get('/admin/users/:id/edit', userController.edit)
router.post('/admin/users/:id/update', userValidators, userController.update)

// router.get(
//   '/admin/logged-in-users',
//   ensureAuthenticated,
//   ensureActiveUser,
//   ensureAdmin,
//   sessionController.index
// )

module.exports = { webRoutes: router }
