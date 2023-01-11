const moment = require('moment-timezone');

module.exports = {
  formatDateValue: function (date) {
    formattedDate = moment(date).format('YYYY/MM/DD').tz('GMT').replaceAll('/', '-');
    return formattedDate;
  },
};
