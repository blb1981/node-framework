/** @type {typeof import('../models/Session').Session} */
const Session = require('../models').Session

const index = async (req, res) => {
  return res.send('Show active sessions')
  const sessions = await Session.findAll({ where: {} })
}

module.exports = { sessionController: { index } }
