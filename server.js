require('dotenv').config({ quiet: true })
const { app } = require('./app')
const port = process.env.PORT || 5000
const { devMode } = require('./config/constants')
const chalk = require('chalk')

app.listen(port, () => {
  if (devMode) {
    console.log(
      chalk.blueBright(
        `✈️  Express server listening on http://localhost:${port}`
      )
    )
    console.log(
      chalk.blueBright(
        `📨 Mailhog potentially running on http://localhost:8025`
      )
    )
  }
})
