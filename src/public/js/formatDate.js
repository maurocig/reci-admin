const moment = require('moment-timezone');

module.exports = {
  formatDate: function (date) {
    formattedDate = moment(date).format('DD/MM/YYYY');
    return formattedDate;
  },
  formatDateValue: function (date) {
    formattedDate = moment(date).format('DD/MM/YYYY').replaceAll('/', '-');
    return formattedDate;
  },
};
