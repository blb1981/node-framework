const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

const { transporter } = require('./transporter')
const { asyncHandler } = require('../utils/asyncHandler')

const sendEmail = asyncHandler(
  async ({ to, subject, templateName, context }) => {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.ejs`
    )
    const source = fs.readFileSync(templatePath, 'utf-8')
    const compiled = ejs.compile(source)
    const html = compiled(context)

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
  }
)

module.exports = { sendEmail }
