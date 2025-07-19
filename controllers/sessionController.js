/** @type {typeof import('../models/Session').Session} */
// const Session = require('../models').Session

const index = async (req, res) => {
  return res.send('Show active sessions. Feature will be added later.') // TODO: Add feature later
}

module.exports = { sessionController: { index } }
