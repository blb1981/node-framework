const { asyncHandler } = require('../utils/asyncHandler')
const { sendEmail } = require('./emailService')

const sendWelcomeEmail = asyncHandler(async (user) => {
  return await sendEmail({
    to: user.email,
    subject: 'Welcome to the app',
    templateName: 'welcomeEmail',
    context: { name: user.firstName },
  })
})

const sendPasswordResetEmail = asyncHandler(async (emailAddress, resetLink) => {
  return await sendEmail({
    to: emailAddress,
    subject: 'Reset your password',
    templateName: 'forgotPassword',
    context: { resetLink },
  })
})

module.exports = { sendWelcomeEmail, sendPasswordResetEmail }
