const { format } = require('date-fns')

const getDateOnly = (dateObject) => {
  return format(dateObject, 'PP')
}

const getDateAndTime = (dateObject) => {
  return format(dateObject, 'PPpp')
}

module.exports = { getDateOnly, getDateAndTime }
