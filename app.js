const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const csrf = require('csurf')
const expressLayouts = require('express-ejs-layouts')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const { webRoutes } = require('./routes/webRoutes')
const { sequelize } = require('./models')

const { localsMiddleware } = require('./middleware/localsMiddleware')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { serverErrorHandler } = require('./middleware/serverErrorHandler')

const { devMode } = require('./config/constants')

const app = express()
const sessionStore = new SequelizeStore({ db: sequelize })

// Views/settings
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

// Session/flash settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: !devMode && true,
    },
  })
)
app.use(flash())

// Flash, error, oldInput middleware. Sets empty local variables for templates
app.use(localsMiddleware)

// Passport setup
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// CSRF
app.use(csrf())

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  console.log(devMode && 'Mode: development')
  next()
})

// Expose req.originalUrl to views for redirection after form submission
app.use((req, res, next) => {
  res.locals.req = req
  next()
})

// Routes
app.use('/', webRoutes)

app.get('/error-test', (req, res, next) => {
  throw new Error('Testing 500 errors')
})

// Error handling
app.use(notFoundHandler)
app.use(serverErrorHandler)

module.exports = { app }
