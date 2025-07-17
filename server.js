require('dotenv').config({ quiet: true })
const { app } = require('./app')
const port = process.env.PORT || 5000
const devMode = process.env.NODE_ENV === 'development'

app.listen(port, () => {
  if (devMode) {
    console.log(`Server listening on http://localhost:${port}`)
  }
})
