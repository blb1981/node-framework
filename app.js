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

// TODO: Add rate limiting to public routes with forms
// TODO: Add helmet and CORS middleware

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
      secure: 'auto',
    },
  })
)
app.use(flash())

// Passport setup
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// CSRF
app.use(csrf())

// Flash, error, oldInput middleware. Sets empty local variables for templates
app.use(localsMiddleware)

// Routes
app.use('/', webRoutes)

// Error handling
app.use(notFoundHandler)
app.use(serverErrorHandler)

module.exports = { app }
