const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const csrf = require('csurf')
const expressLayouts = require('express-ejs-layouts')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const { sequelize } = require('./models')
const { webRoutes } = require('./routes/webRoutes')
const { flashMiddleware } = require('./middleware/flashMiddleware')

const app = express()

const sessionStore = new SequelizeStore({ db: sequelize })
const devMode = process.env.NODE_ENV === 'development'

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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: !devMode && true,
    },
  })
)
app.use(flash())

// Flash middleware
app.use(flashMiddleware)

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

// Routes
app.use('/', webRoutes)

module.exports = { app }
