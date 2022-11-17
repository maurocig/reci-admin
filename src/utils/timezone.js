const momentTz = require('moment-timezone');
const moment = require('moment');

module.exports = function getDate() {
  const dateUruguay = moment.tz(Date(), 'America/Montevideo');
  return dateUruguay.format();
};
