const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

/** @type {typeof import('../models/User').User} */
const User = require('../models').User

const { devMode } = require('../config/constants')

const genericLoginMessage = 'Invalid credentials'

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return done(null, false, {
            message: devMode ? 'Incorrect email' : genericLoginMessage,
          })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return done(null, false, {
            message: devMode ? 'Incorrect password' : genericLoginMessage,
          })
        }
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id)
      done(null, user)
    } catch (error) {
      done(error)
    }
  })
}
